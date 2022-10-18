import * React from 'react';
import {
  View,
  Text,
} from 'native-base';

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
