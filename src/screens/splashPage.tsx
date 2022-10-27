import * React from 'react';
import {
  View,
  Text,
} from 'native-base';
function SplashPage() {
  return (
    <View>
      <Box>
      <ScrollView>
        <Heading>Friends</Heading>
        <VStack space={4} alignItems="center">
          {users.map((userobj,i)=>{
            return( 
              <Box 
                key={i} style={{ flex: 1, alignitems: 'center', justifycontent: 'center', }}>
              <Text>
                {userobj.name}
              </Text>
              <Text>
                {userobj.email}
              </Text>
              <Image
                  key={i}
                source={{uri: userobj.photoURL}}
                alt="alternate text"
                borderradius={100}
                size="md"
              />
                  <Button
                    onPress={() => navigate('Chat',
                    { 
                      userId: userobj.userId,
                      name:userobj.name, 
                      email:userobj.email, 
                      photoURL:userobj.photoURL}
                  )}
                  >
                  Chat
                  </Button>
              </Box>
            )
            })
          }
        </VStack>
      </ScrollView> 
     </Box>
    </View>
  );
}
function loaduser(){
    const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const { navigate } = props.navigation;
  
  {/*load all user form database*/}
  //load all user from database except current userObject
  const currentUser = auth.currentUser?.uid
  console.log(currentUser)
  useEffect(() => {
    db.collection('users').where('uid','==',currentUser).get('friends')
      .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //retrive all friends id from current user and put in to friendsArray
        const friendsArray = doc.data().friends
        setFriends(...friendsArray)
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    }).then(()=>{
    db.collection('users').where('uid','==',friends).onSnapshot(snapshot => (
      setUsers(snapshot.docs.map(doc => ({
        userId: doc.data().uid,
        name: doc.data().name,
        email: doc.data().email,
        photoURL: doc.data().imageURL,
      })))
    ))
  })
    console.log(friends)
  }, [])


}
function splash () {
  return (
    <View>
      <Text>My App</Text>
      <ScrollView>
        <ChatList />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <VStack space={4} alignItems="center">
            <Button
              colorScheme="primary"
              onPress={() => {
                console.log('Navigate to login')
                navigate('Login')
              }}>
              Login Screen
            </Button>
            <Button
              variant={"subtle"}
              colorScheme="primary"
              onPress={() => {
                navigate('MessageTest')
                console.log('Navigate to messageTest')
              }}>MessageTest
            </Button>
              <Button
                variant={"subtle"}
                colorScheme="primary"
                onPress={() => {
                  navigate('Register')
                  console.log('Navigate to Register')
                }}>Register</Button>
            <ThemeToggle />
          </VStack>
        </View>
      </ScrollView>
 
    </View>
  )
}
