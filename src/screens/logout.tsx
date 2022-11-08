import React,{
  useState,
  useEffect,
} from 'react';
import {
  Modal,
  Text,
  Button,
} from 'native-base';


function  Logut() {
    const [modalVisible, setModalVisible] = useState(false);

  return(
  <>
  <Text>Logout</Text>
  
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
              <Button onPress={() => signOut}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
    </Modal>
</>
  )
}
export default Logut;
  
