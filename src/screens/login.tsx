import React, { useCallback, useState } from 'react'
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
} from 'native-base'


export enum AuthState {
  None,
  Login,
  Loading,
  LoginError,
  RegisterError,
}

const LoginScreen = (props: { navigation: { navigate: any; }; }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authState, setAuthState] = useState(AuthState.None);

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
          Welcome
        </Heading>
        <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email ID</FormControl.Label>
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
              type="password" />
            <Link _text={{
              fontSize: "xs",
              fontWeight: "500",
              color: "indigo.500"
            }} alignSelf="flex-end" mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button
            mt="2"
            colorScheme="indigo"
            isLoading={authState === AuthState.Loading}

          >
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
              I'm a new user.{" "}
            </Text>
            <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }}

            >
              Sign Up
            </Link>
          </HStack>
          {authState === AuthState.LoginError && (
            <Text color="red.500">Login failed</Text>
          )}
          {authState === AuthState.RegisterError && (
            <Text color="red.500">Register failed</Text>
          )}

        </VStack>
      </Box>
    </Center>
  )
}
export default LoginScreen;
