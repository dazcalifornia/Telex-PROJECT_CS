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
