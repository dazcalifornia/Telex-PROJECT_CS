import React,{
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
    View,
    Text,
    Button,
    HStack,
    Box,
    ScrollView,
    VStack,
    List,
    Divider,
    Heading,
    Icon,
    IconButton,
    Pressable,
    Modal,
    Input,
    Select,
    CheckIcon,
} from 'native-base';
import{
  CreateGroup,
  addMember,
  removeMember,
  deleteGroup,
  leaveGroup,
  AcceptInvite,
}from "../components/eventHandle/Groupchat"
import {auth,db} from '../../firebase';
import {Entypo} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase/compat/app';

const Stations = (props:any) => {
  console.log('props',props);
  const {navigate,goBack} = props.navigation;
  const [stations, setStations] = useState([]);
  const [menuModal, setMenuModal] = useState(false);
  const [groupname, setGroupname] = useState('');
  const [category, setCategory] = useState('');
  const [groupInvite, setGroupInvite] = useState([]);

  const loadStations = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      //load group from firebase
      db.collection('group').where('members', 'array-contains', uid).onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setStations((prev) => [...prev, ...data]);
       console.log('stations', stations);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadgroup =() =>{
    db.collection('users').doc(auth.currentUser?.uid).get().then((snapshot) => {
      //map user data
      const data = snapshot.data()
      let inviteKey = Object.keys(data?.groupInvite)
      db.collection('group').where('groupId', 'in', inviteKey).get().then((snapshot) => {
        snapshot.docs.map((doc) => {
          const data = doc.data()
          setGroupInvite((prev) => [...prev, data])
        })
      })
      console.log('group invite:',groupInvite)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    setStations([]);
    loadStations();
          //get group invite from user collection
    loadgroup();

  }, []);


  return (
    <View
    flex={1}
  >
    <LinearGradient
      colors={['#2193B0', '#6DD5ED']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
      }}
    />
      {/*header*/}
    <Box>
      <HStack
        px={2}
        py={4}
        shadow={2}
        rounded="md"
        alignItems="center"
        justifyContent="flex-start"
        safeAreaTop
      >
        <IconButton
        ml="34px"
        variant="ghost"
        _icon={{
          as: Entypo,
          name: "chevron-left",
          size: 9,
          color: "subbase",
        }}
        onPress={() =>{ 
          console.log('go Back')
          props.navigation.goBack()
          }
        }
      />
        <Heading size="xl" color="white">
            Stations
        </Heading>
          <Icon as={Entypo} name="chat" size={5} color="white" ml="2" mr="2" />
          <IconButton
            justifyContent="flex-end"
            variant="ghost"
            _icon={{
              as: Entypo,
              name: "plus",
              size: 9,
              color: "subbase",
            }}
            onPress={() =>{
              console.log('go to create group')
              setMenuModal(true)
            }}
          />
            <Modal isOpen={menuModal} onClose={() => setMenuModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Create Group</Modal.Header>
                <Modal.Body>
                  <VStack space={3}>
                  <Input
          placeholder="Enter a Groupname"
          value={groupname}
          onChangeText={(nextValue) => setGroupname(nextValue)}
        />
          <Select
            selectedValue={category}
            minWidth={200}
            accessibilityLabel="Select a setCategory"
            placeholder="Select a setCategory"
            onValueChange={(itemValue) => setCategory(itemValue)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size={4} />,
            }}
          >
            <Select.Item label="General" value="General" />
            <Select.Item label="Game" value="Game" />
            <Select.Item label="Study" value="Study" />
            <Select.Item label="Work" value="Work" />
          </Select>
                    <Button
                      px = "10px"
                      borderRadius="15px"
                      variant="solid"
                      bg="#06C755"
                      _text={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 'md',
                      }}
                      onPress={() => {
                        CreateGroup({name:groupname,category:category})
                        setStations([])
                        setMenuModal(false)
                        }}
                    >
                      Create Group
                    </Button>
                   
                  </VStack> 
                </Modal.Body>
              </Modal.Content>
            </Modal>


      </HStack>
        <Divider w="80%" alignSelf="center" />
    </Box>
    {/*body*/}
    <Box
        flex={1}
        mt={2}
        shadow={2}
        p={2}
        h="auto"
      >
          {groupInvite.map((groupInvite,index) => (
    <Box key={index}
    space={4}
    justifyContent="space-between"
    alignItems="flex-start"
    bg="#D9D9D9"
    borderRadius="10px"
    w="auto"
    h="45px"
    m="15px">
      <HStack space={2}>
        <Text fontSize="sm" bold>
          {groupInvite.name}
        </Text>
        <IconButton
        icon={<Icon as={<Entypo name="cross" />} size="sm" />}
        onPress={() => {
          //delete groupInvite 
          console.log(groupInvite);
          db.collection('users').doc(auth.currentUser?.uid).update({
            groupInvite: firebase.firestore.FieldValue.arrayRemove(groupInvite)
          }).then(() => {
            goBack()
          })

        }}
      />
      <IconButton
        icon={<Icon as={<Entypo name="check" />} size="sm" />}
        onPress={() => {
          //add groupInvite to group
          AcceptInvite({groupId: groupInvite.groupId})
          goBack()
        }}
      />
      </HStack>
      
    </Box>
  ))}
      {stations ? (
        <ScrollView
          w="100%"
          showsHorizontalScrollIndicator={false}
        >
        <VStack m="3px" px="21px" space={4}>
        
        {stations.map((stations, index) => (
        <Pressable
          key={index}
          onPress={() => {
            console.log('stations',stations);
            navigate('GroupChat', {groupName: stations.name, groupId: stations.groupId,groupOwner:stations.groupOwner});
          }}
        >
          <Box
            key={index}
            space={4}
            justifyContent="space-between"
            alignItems="flex-start"
            bg="#D9D9D9"
            borderRadius="10px"
            w="auto"
            h="45px"
            m="15px"
          >
            <HStack m="3px" px="18px" space={4}>
              <Text
                color="black"
                fontSize="md"
                fontWeight="bold"
                textAlign="center"
                alignSelf="center"
              >
                {stations.name}
              </Text>


            </HStack>
          </Box>
        </Pressable>
        ))}
        </VStack>
        </ScrollView>
      ) : (
        <Text>loading...</Text>
      )}

    </Box>
  </View>
  );
}
export default Stations;



