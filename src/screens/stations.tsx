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
} from 'native-base';
import {auth,db} from '../../firebase';

const Stations = () => {
  const [stations, setStations] = useState([]);

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
  }, [stations]);


  useEffect(() => {
    loadStations();

  }, []);


  return (
    <View
     alignContent="center"

    >
     {stations ? (
        <ScrollView
          w="100%"
          showsHorizontalScrollIndicator={false}
        >
        <VStack m="3px" px="21px" space={4}>
        {stations.map((stations, index) => (
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
            <HStack m="3px" px="21px" space={4}>
              <Button
                px="10px"
                borderRadius="15px"
                variant="solid"
                bg="#06C755"
                _text={{
                  color: 'black',
                  fontSize: 'sm',
                  fontWeight: 'bold',
                }}
                onPress={() => console.log('pressed')}
              >
                {stations.name}
              </Button>
            </HStack>
          </Box>

        ))}
        </VStack>
        </ScrollView>
      ) : (
        <Text>loading...</Text>
      )}

    </View>
  );
}
export default Stations;



