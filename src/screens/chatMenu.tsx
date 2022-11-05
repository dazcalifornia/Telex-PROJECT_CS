import React,{
  useState,
  useEffect,
} from 'react';

import {
  IconButton,
  Text,
  Select,
  Box,
  CheckIcon,
  Center,
  VStack,
  } from 'native-base';

const ChatMenu = (props:{channelId:string,chatName:string}) => {
  const {channelId, chatName} = props.route.params;

  const [chatList, setChatList] = useState([]);
  
  useEffect(() => {
    //load channel from firebase

    console.log('chatId bruh',channel)
    resloveChannel(channel);
  }, [channel])

  const resloveChannel = () => {
    console.log('channel', channel)
  }
  const changeChannel = (itemValue:string) => {
    setChannel(itemValue);
  };

  return (
    <>
      <Center flex={1}>
        <VStack space={2} alignItems="center">
          <Text fontSize="lg" bold>
            Select a channel
          </Text>
          <Select
            minWidth={200}
            accessibilityLabel="Select a setService"
            placeholder="Select setService"
            selectedValue={channel}
            onValueChange={(itemValue) => changeChannel(itemValue)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size={4} />,
            }}
          >
            <Select.Item label="Facebook" value="facebook" />
            <Select.Item label="Instagram" value="instagram" />
            <Select.Item label="Twitter" value="twitter" />
            <Select.Item label="LinkedIn" value="linkedin" />
          </Select>
        </VStack>
      </Center>
    </>
  )
}

export default ChatMenu
