import { 
  Box,
  View,
  Text,
  HStack,
  StatusBar,
  IconButton,
  Image,
  Modal,
  Button
} from 'native-base'
import React from 'react'
import { Entypo } from '@expo/vector-icons';

import {auth} from '../../firebase';


//modal import 
import {accMenus} from './accMenus';

const Header = (props:{navigation:{navigate:any;};}) => {
  
  const [modalVisible, setModalVisible] = React.useState(false);
  
  const {navigate} = props.navigation;

  const userMenu = () => {
    return(
      <Modal 
        isOpen={modalVisible} 
        onClose={() => setModalVisible(false)}
        justifyContent="flex-end"
        >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Account</Modal.Header>
          <Modal.Body>
            <Text>Account</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button onPress={() => setModalVisible(false)}>Cancel</Button>
              <Button onPress={() => setModalVisible(false)}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
    </Modal>
    )
  }

  return (
    <>
    <StatusBar barStyle="light-content" />
    <HStack safeAreaTop bg="base" px="1" py="3" 
        justifyContent="space-between" 
        alignItems="center" w="100%" h="165px">
        <Image source={{
          uri: auth?.currentUser?.photoURL
        }} alt="Profile image" ml="24px" size={65} rounded="full" />
        {/*/<HStack alignItems="center" ml="24px">
          //<Text color="white" fontSize="2xl" fontWeight="bold">Logo</Text>
        </HStack>/*/}
          <Text color="white" fontSize="2xl" fontWeight="bold">Hello "{auth?.currentUser?.displayName}"</Text>
        <IconButton
          mr="24px"
          borderRadius="15px"
          variant="solid"
          colorScheme="indigo"
          _icon={{
            as: Entypo,
            name: "dots-three-vertical",
            size: 5,
            color: "subbase",
          }}
          onPress={() => navigate('UserMenu')}
        />
    </HStack>
    </>
  )
}

export default Header


