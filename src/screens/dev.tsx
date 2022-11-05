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
        <Select
          minWidth={200}
          accessibilityLabel="Select a setService"
          placeholder="Select setService"
          selectedValue={service}
          onValueChange={(itemValue) => setService(itemValue)}
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
  );
};

