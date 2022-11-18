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
import {auth,db} from '../../firebase'

import {CreateGroup, Groupchat} from "../components/eventHandle/Groupchat";

export default  function DEV () {
  const [service, setService] = useState('');
  const [category, setCategory] = useState('');

  //get datagrom Groupchat() component 
  const [groupchat, setGroupchat] = useState([]);
  
  const userId = auth?.currentUser?.uid;
  const fetchGroupchat = async (userId:string):Promise<T> => {
    const {groupchat} = await Groupchat(userId);
    setGroupchat(groupchat);
  }
  console.log('groupchat',groupchat)


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

        <Text fontSize="lg" bold>
          {service}
        </Text>
        <Button
          onPress={() => {
            //send service to CreateGroup 
            console.log(service);
            CreateGroup({name: service, category: category});
          }}
        >Send Data</Button>
      </VStack>
    </Center>
  );
};

