import React, { useState, useEffect, useRef } from 'react';
import {
  Center,
  Box,
  FormControl,
  Heading,
  Input,
  VStack,
  Button,
  Image,
  KeyboardAvoidingView,
  Text,
  Icon,
  Pressable,
} from 'native-base';
import {LinearGradient} from 'expo-linear-gradient';
import {auth, db} from '../../firebase';//firebase auth
import { Entypo } from '@expo/vector-icons';
const Register = (props:{navigation:{navigate:any;};}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [show, setShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});
  
  const validateData = () => {
    if (name === '') {
      setError({...error,
      name: 'Name is required'});
      return false;
    }else if (email === '') {
      setError({...error,
      email: 'Email is required'});
      
      return false;
    }else if (email.indexOf('@') === -1) {
      setError({...error,
      email: 'Email is not valid'});
      return false;
        
    }else if (password === '') {
      setError({...error,
      password: 'Password is required'});
      return false;
    }else if (confirmPassword === '') {
      setError({...error,
      confirmPassword: 'Confirm Password is required'});
      return false;
    }else if (password !== confirmPassword) {
      setError({...error,
      confirmPassword: 'Password does not match'});
      return false;
    }else {
      setError({});
      return true;
    }
  };
  const onSubmit = () => {
    validateData() ? register() : null;
  };

  const register = () => {
    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      user.updateProfile({
        displayName: name,
        photoURL: imageURL? imageURL :"https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png",
      }).then(function() {
        db.collection('users').doc(user.uid).set({
          uid: userCredential.user.uid,
          friends: {},
          friendRequest: {},
          email: userCredential.user.email,
          name: user.displayName,
          imageURL: user.photoURL,
          username: "",
        })
            props.navigation.replace('Login');
      })
      .catch((error) => {
        // An error occurred
        alert(error.message);
      });
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  };
  return (
    <>
    <LinearGradient
      colors={['#FFE259', '#FFA751']}
      start={[0,0 ]}
      end={[1,1]}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
      }}
    >
    <Image
      source={require('../../assets/wave2.png')}
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
    
    <Center
      flex={1}
      px={2}
      w="90%"
      mx="auto"
    >
      <Image
      source={require('../../assets/register-mesh.png')}
      alt="register"
      size="350px"
      resizeMode="cover"
      borderRadius={100}
    />
      <Box  borderRadius="lg" safeArea p="2" w="80%">
        <Heading size="lg" color="coolGray.800" fontWeight="bold">
          Become a member!
        </Heading>
        <FormControl mt={4} isRequired isInvalid={'name' in error}>
          <FormControl.Label
            _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
          >Name</FormControl.Label>
          <Input
            isInvalid={'name' in error}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Enter your name"
            borderRadius="10"
            _focus={{ borderColor: '#A5F3FC' }}
            justifyContent="center"
            InputRightElement={
                <Icon 
                  as={<Entypo name="user" />}
                  size="sm"
                  mr={2}
                  color="muted.400"
                />
              }
          />
          {'name' in error ? <FormControl.ErrorMessage>{error.name}</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl mt={4} isRequired isInvalid={'email' in error}>
          <FormControl.Label
            _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
          >Email</FormControl.Label>
          <Input
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Enter your email"
            borderRadius="10"
            _focus={{ borderColor: '#A5F3FC' }}
            justifyContent="center"
            InputRightElement={
                <Icon 
                  as={<Entypo name="mail" />}
                  size="sm"
                  mr={2}
                  color="muted.400"
                />
              }
          />
          {'email' in error ? <FormControl.ErrorMessage>{error.email}</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl mt={4} isRequired isInvalid={'password' in error}>
          <FormControl.Label
            _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
          >Password</FormControl.Label>
          <Input
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Enter your password"
            borderRadius="10"
            _focus={{ borderColor: '#A5F3FC' }}
            justifyContent="center"
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon 
                  as={<Entypo name={show ? "eye-with-line" : "eye"} />}
                  size="sm"
                  mr={2}
                  color="muted.400"
                />
              </Pressable>
            }
            type={show ? "text" : "password"}
          />
          {'password' in error ? <FormControl.ErrorMessage>{error.password}</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl mt={4} isRequired isInvalid={'confirmPassword' in error}>
          <Input
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            placeholder="Confirm your password"
            borderRadius="10"
            _focus={{ borderColor: '#A5F3FC' }}
            justifyContent="center"
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon 
                  as={<Entypo name={show ? "eye-with-line" : "eye"} />}
                  size="sm"
                  mr={2}
                  color="muted.400"
                />
              </Pressable>
            }
            type={show ? "text" : "password"}
          />
          {'confirmPassword' in error ? <FormControl.ErrorMessage>{error.confirmPassword}</FormControl.ErrorMessage> : null}
        </FormControl>

          <Button
            mt={4}
            colorScheme="cyan"
            _text={{ color: 'white' }}
            onPress={onSubmit}
          >
            Register 
          </Button>
      </Box>
    </Center>
    </KeyboardAvoidingView>
    </>
  );
}
export default Register;
