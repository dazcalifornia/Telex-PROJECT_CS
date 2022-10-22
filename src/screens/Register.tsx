import React, { useState, useEffect, useRef } from 'react';
import {
  Center,
  Box,
  FormControl,
  Heading,
  Input,
  VStack,
  Button,
} from 'native-base';

import {auth, db} from '../../firebase';//firebase auth
const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');

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
          friend: [],
          email: userCredential.user.email,
          name: user.displayName,
          imageURL: user.photoURL,
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

    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading size="lg" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }} fontWeight="semibold">
          Welcome
        </Heading>
        <Heading mt="1" color="coolGray.600" _dark={{
        color: "warmGray.200"
      }} fontWeight="medium" size="xs">
          Sign up to continue!
        </Heading>
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              value={email}
              onChangeText={setEmail}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              value={password}
              onChangeText={setPassword}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              value={name}
              onChangeText={setName}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Profile Picture URL</FormControl.Label>
            <Input
              value={imageURL}
              onChangeText={setImageURL}
            />
          </FormControl>

          <Button mt="2" colorScheme="indigo"
            onPress={register}
          >
            Sign up
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
export default Register;
