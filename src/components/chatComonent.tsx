import React from 'react';

import {
    InputToolbar,
} from 'react-native-gifted-chat';




export const ChatInputToolbar = (props) => {
  return (
      <InputToolbar
        {...props}
        //renderComposer={() => renderComposer(props)}
        containerStyle={{
          //make it blur and adjust it to center screen
          //text white
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'white',
          marginHorizontal: 10,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
       />
    );
}

