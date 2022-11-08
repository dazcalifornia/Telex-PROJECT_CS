import React from "react";
import { 
  Select,
  Box, 
  CheckIcon, 
  Center,
  Text,
  VStack
} from "native-base";

export default function DEV() {
  let [service, setService] = React.useState("");
  return (
    <Center flex={1}>
      <VStack space={2} alignItems="center">
        <Text fontSize="lg" bold>
          Select a setService
        </Text>
          
      </VStack>
    </Center>
  );
};

