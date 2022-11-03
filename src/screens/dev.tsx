import React from 'react';
import {
  View,
  Text,
  Select,
  CheckIcon,
  Box,
} from 'native-base';

export default function DEV(props: { navigation: { navigate: any; }; }) {
  const [service, setService] = React.useState("");

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="#D9D9D9"
      borderRadius="10px"
      w="auto"
      h="45px"
      m="15px"
    >

      <Text>DEV</Text>
    </View>
  );
}
