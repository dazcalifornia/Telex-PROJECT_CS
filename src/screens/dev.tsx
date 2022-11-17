import React,{
    useState,
    useEffect,
  } from "react";
import { 
  Select,
  Box, 
  CheckIcon, 
  Center,
  Text,
  VStack,
  Input,
  Button
} from "native-base";


import {CreateGroup, Groupchat} from "../components/eventHandle/Groupchat";

export default  function DEV () {
  const [service, setService] = useState('');

  const groupData =  Groupchat();
  console.log(groupData);
  return (
    <Center flex={1}>
      <VStack space={2} alignItems="center">
        <Text fontSize="lg" bold>
          Select a setService
        </Text>
        <Input
          placeholder="Enter a setService"
          value={service}
          onChangeText={(nextValue) => setService(nextValue)}
        />
        <Text fontSize="lg" bold>
          {service}
        </Text>
        <Button
          onPress={() => {
            //send service to CreateGroup 
            console.log(service);
            CreateGroup({name: service});
          }}
        >Send Data</Button>
      </VStack>
    </Center>
  );
};

