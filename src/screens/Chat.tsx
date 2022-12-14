import React, { 
  useState,
  useEffect, 
  useLayoutEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {auth, db,storage} from '../../firebase';

import {
  pickImage,
  uploadImage,
} from '../components/eventHandle/mediaUtils';

import {
  View,
  IconButton,
  Icon,
  Text,
  HStack,
  Button,
} from 'native-base';

import { 
  GiftedChat,
  InputToolbar,
  Actions,
  Bubble,
  MessageImage,
  IMessage,
  Composer,
  Send,
} from 'react-native-gifted-chat';
import ChatHeader from '../components/chatHeader';

import { Entypo } from '@expo/vector-icons';

function Chat (props:{
  route: any;userId:string,name:string, email:string, photoURL:string,navigation:any
}) {

  const {userId, name, email, photoURL} = props.route.params;

  const [messages, setMessages] = useState<IMessage[]>([]);


  const [channel, setChannel] = useState([]) //load subroom from firebase

  const [chatName, setChatName] = useState('') //load chat name from firebase specific to userId

  const [userImage, setUserImage] = useState(null)


  const member = [auth.currentUser?.uid, userId];

  const chatId = member.sort().join('_');
 
  useLayoutEffect(() => {
    const loadChat = db.collection('Chatroom').doc(chatId).collection('messages')
    .orderBy('createdAt', 'desc').onSnapshot(snapshot => (
        setMessages(snapshot.docs.map(doc => ({
        _id: doc.data()._id,    
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        image: doc.data().image,
        sent: doc.data().sent,
        received: doc.data().received,
        video: doc.data().video,
        user: doc.data().user,
      })))
    ))
    return loadChat;

  }, [])

{/*
const onSend = useCallback((messages = []) => {
  // Check if the current message is an image or text
  const message = messages[0];
  if (message.image) {
    // If the message is an image, upload it to Firebase Storage
    uploadImage(message.image).then((imageUrl) => {
      // Update the message object with the URL of the uploaded image
      const updatedMessage = {
        ...message,
        image: imageUrl,
      };

      // Add the updated message to the list of messages
      setMessages((prevMessages) => GiftedChat.append(prevMessages, updatedMessage));

      // Save the message to Firebase Firestore
      saveMessage(updatedMessage);
    });
  } else {
    // If the message is text, save it to Firebase Firestore
    saveMessage(message);

    // Add the message to the list of messages
    setMessages((prevMessages) => GiftedChat.append(prevMessages, message));
  }
}, []);
    */}

  const onSend = useCallback((messages = []) => {
    //checf currentMessage is image or text
    //if image, upload to firebase storage
    //if text, upload to firebase firestore
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt, 
      text,
      user, 
    } = messages[0]
   
     db.collection('Chatroom').doc(chatId).set({
      chatId: chatId,
      member: member,
      chatName: "Regular",
      recentMessage: {
        _id: _id,
        createdAt: createdAt,
        text: text,
        user: user
      }
    }).then(() => {
      db.collection('Chatroom').doc(chatId).collection('messages').doc(_id).set({
        _id: _id,
        createdAt,
        address: "Regular",
        text: text,
        image: userImage,
        user: user,
        sent: true,
        received: false,
      }).then(() => {
        console.log('message sent')
        setUserImage(null)
      })
    })

  }, [])
  const renderActions = (props) => {
    return (
      <Actions
        {...props}

        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          marginBottom: 0,
        }}
        icon={() => (
          <Icon
            as={<Entypo name="camera" />}
            size="sm"
            color="muted.400"
          />
        )}
        options={{
          'Choose From Library': () => {
            console.log('Choose From Library')
            //pickimage and set result to image 
            pickImage().then((result) => setUserImage(result)).catch((error) => console.log(error))
            console.log("image fromchat:", userImage)
            const updatemessage = {
              ...messages,
              image: userImage || '',
            };
            console.log("message fromchat:", updatemessage)
            setMessages((prevMessages) => GiftedChat.append(prevMessages, updatemessage));
            onSend(updatemessage)

          },
          

          Cancel: () => { console.log("image", userImage)

            console.log('Cancel')
          },
        }}
        optionTintColor="#222B45"
      />

    )
  }


  const renderComposer = (props:any) => {
    return (
         <Composer 
          {...props}
          textInputStyle={{
            color: '#222B45',
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 4,
            marginBottom: 0,

          }}
          placeholder="Type a message"
          placeholderTextColor="#9CA3AF"
      />
    )
  }

  const customInputToolbar = (props:any) => {
    return(
      <>
       {userImage &&  (
          <View
            style={{
              position: 'absolute',
              bottom: 41,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
              marginBottom: 10,
              right: 0,
            }}
          >
            <MessageImage
              {...props}

              imageStyle={{
                width: 200,
                height: 200,
                borderRadius: 10,
                margin: 5,
              }}
              imageProps={{
                resizeMode: 'cover',
              }}
              currentMessage ={{
                  image: userImage,
              }}
            />
            <IconButton
              icon={<Icon as={<Entypo name="cross" />} size="sm" color="muted.400" />}
              onPress={() => setUserImage(null)}
              variant="solid"
              size="sm"
              bg="white"
              borderRadius="full"
              style={{position: 'absolute', right: 0, top: 0, zIndex: 1}}
            />
          </View>
        )}

      <InputToolbar
        {...props}
        //renderComposer={() => renderComposer(props)}
        containerStyle={{
          //make it blur and adjust it to center screen
          //text white
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 1,
          color:"subalt",
          borderColor: 'white',
          marginHorizontal: 10,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
       />
       </>
      )
  }
  const renderBubble = (props:any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2DD7A6',
          },
          left: {
            backgroundColor: '#ECECEC',
          },
        }}
        textStyle={{
          right: {
            color: '#171717',
          },
          left: {
            color: '#171717',
          },
        }}
        timeTextStyle={{
          right: {
            color: '#171727',
          },
          left: {
            color: '#171727',
          },
        }}
      />
    )
  }

  const renderSend = (props:any) => {
    return (
      <Send
        {...props}
        
        disabled={!props.text}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 4,
          marginBottom: 0,
        }}
      >
        <Icon
          as={<Entypo name="paper-plane" />}
          size="sm"
          color={props.text||userImage ? '#2DD7A6' : '#9CA3AF'}

        />
      </Send>
    )
  }
  const longpressHandler = (context:any, message:any) => {
    console.log('msg: ', message)
    const options = ['Delete', 'Cancel']
    const cancelButtonIndex = options.length - 1
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            // delete message
            // deleteMessage(message)
            // console.log("delete", message)
            // console.log("delete", message._id)
            //
            db.collection('Chatroom').doc(chatId).collection('messages').doc(message._id).delete()
            break
          default:
            break
        }
      },
    )
  }

  return (
    <View style={{flex:1, backgroundColor:'#1D1E24'}}>
      <ChatHeader chatId={chatId} navigation={props.navigation} route={props.route}/>
      <GiftedChat
        onLongPress={(context, message) => longpressHandler(context, message)}
        fontFamily="Prompt"
        fontWeight="500"
        renderActions={() => renderActions(props)}
        alwaysShowSend
        scrollToBottom
        sendOnEnter
        isTyping
        isAnimated

        messages={messages}
        renderComposer={(props:any) => renderComposer(props)}
        renderSend={props => renderSend(props)}
        renderBubble={renderBubble}
        showUserAvatar={true}
        renderInputToolbar={props => customInputToolbar(props)}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth?.currentUser?.uid,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL
        }
      }
      />
      
    </View>
  );
}
export default Chat;
