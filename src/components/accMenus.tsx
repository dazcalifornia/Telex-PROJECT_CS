import React,{useState,useEffect} from 'react';

import {
  Text,
  Input,
  Button,
  Modal,
} from 'native-base';


function addFriends(){
  console.log("add friends");
  return(
    <>
      <Modal presentationStyle="pageSheet">
        <Text>Modal Content</Text>
      </Modal>
    </>
  )
}
export default addFriends;
