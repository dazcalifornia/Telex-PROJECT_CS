import React, { useCallback, useState,useEffect } from 'react'
import {
    Platform,
} from 'react-native';
import {
  Text,
  Button,
  VStack,
  Input,
  FormControl,
  HStack,
  Box,
  Heading,
  Link,
  Center,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Icon,
  Pressable,
} from 'native-base'

import {LinearGradient} from 'expo-linear-gradient';
import { auth } from '../../firebase'

import { Entypo } from '@expo/vector-icons';

const LoginScreen = (props: { navigation: { navigate: any; }; }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function(user) {
      if (user) {
        props.navigation.replace('Home')
      } else {
        // No user is signed in.
      }
    });
    return unsubscribe;
  }, []);
  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage)
      });
  }
  return (
    <> 
    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    
      <LinearGradient 
        colors={['#FFEFBA', '#FFFFFF']}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      >
      <Image
        source={require('../../assets/wave.png')}
        alt="bg"
        size="xl"

        position="absolute"
        zIndex={-1}
        w="100%"
        h="50%"
      />
      </LinearGradient>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Center flex={1} px={2} w="90%" mx='auto'>
      

        <Image 
          source={require('../../assets/login-mesh.png')}
          alt="Alternate Text"
          size="350px"
          resizeMode="cover"
          borderRadius={100}
          my={5}
        />
        <Heading size="lg" color='primary.500'>
          Welcome back! to TELEX 
        </Heading>
        <Text color='muted.400' textAlign='center'>
          Sign in to continue
        </Text>
        <VStack space={2} mt={5}>
          <FormControl>
            <FormControl.Label
              _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
            >
              Email ID
            </FormControl.Label>
            <Input 
              w="50%"
              InputRightElement={
                <Icon 
                  as={<Entypo name="mail" />}
                  size="sm"
                  mr={2}
                  color='muted.500'
                />
              }
              placeholder='Enter Email'
              onChangeText={(text) => setEmail(text)} />
          </FormControl>
          <FormControl mt={2}>
            <FormControl.Label
              _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
            >
              Password
            </FormControl.Label>
            <Input 
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                <Icon 
                  as={<Entypo name={show ? "eye":"eye-with-line"} />}
                  size="sm"
                  mr={2}
                  color='muted.500'
                />
                </Pressable>
              }
              w="50%" 
              placeholder='Enter your password' 
              type={show ? "text" : "password"} 
              onChangeText={(text) => setPassword(text)} />
          </FormControl>
          <Button
            backgroundColor="#A5F3FC"
            _text={{ color: 'black' }}
            endIcon={<Icon as={<Entypo name="chevron-right" />} size="sm" color="black" />}
            onPress={() => signIn()}
          >
            Sign In
          </Button>
        </VStack>
        <HStack justifyContent="center" mt={5}>
          <Text fontSize="sm" color='muted.700' fontWeight={400}>
            I'm a new user.{' '}
          </Text>
          <Link
            _text={{ color: 'cyan.500', bold: true, fontSize: 'sm' }}
            onPress={() => props.navigation.navigate('Register')}
          >
            Sign Up
          </Link>
        </HStack>
      </Center>
    </KeyboardAvoidingView>
    </>
  )
}
export default LoginScreen;
