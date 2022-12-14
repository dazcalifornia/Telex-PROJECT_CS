import React ,{
  useState,
  useEffect,
  useCallback,
  useLayoutEffect
}from 'react';
import {
  View,
  Text,
  Button,
  Box,
  HStack,
  IconButton,
  Modal,
  VStack,
  Input,
  Icon,
}from 'native-base';
import {auth,db} from '../../firebase';
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
import { Entypo } from '@expo/vector-icons';
import {
  CreateGroup,
  addMember,
  removeMember,
  deleteGroup,
  leaveGroup,
  AcceptInvite,} from '../components/eventHandle/Groupchat'
  import {
    pickImage,
    uploadImage,
  } from '../components/eventHandle/mediaUtils';
const GroupChat = (props:any) => {
  console.log('props',props);
  const userId = auth.currentUser?.uid;
  const {navigate,goBack} = props.navigation;
  const {groupId,groupName,groupOwner} = props.route.params;

  const [menuModal, setMenuModal] = useState(false);
  const [adduser, setAdduser] = useState('');
  const [userImage, setUserImage] = useState(null)
  const [messages, setMessages] = useState<IMessage[]>([]);

  useLayoutEffect(() => {
    const loadChat = db.collection('group').doc(groupId).collection('messages')
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
  
      db.collection('group').doc(groupId).collection('messages').doc(_id).set({
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
    <View style={{flex:1}}>
      <Box
        bg='#1D1E24'
        flex={1}
        px={2}
        py={2}
        safeAreaTop
      >
      <HStack
        justifyContent='space-between'
        alignItems='center'
        bg='#1D1E24'
        px={2}
        py={2}
      >
        <IconButton
          icon={<Entypo name="chevron-left" size={24} color="white" />}
          onPress={() => goBack()}
        />
        <Text style={{color:'white', fontSize:20, fontWeight:'bold', margin:10}}>You're in {groupName}</Text>
        <IconButton
          icon={<Entypo name="dots-three-vertical" size={24} color="white" />}
          onPress={() => setMenuModal(true)}
        />
        <Modal isOpen={menuModal} onClose={() => setMenuModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Modal Title</Modal.Header>
            <Modal.Body>
                <VStack space={2}>
              <Button onPress={() => {
                leaveGroup({groupId:groupId})
                navigate('Home')
                }}>Leave Group</Button>
              <Input 
                  placeholder="Enter username to add"
                  onChangeText={(text) => setAdduser(text)}
                />
                <Button
                  onPress={() => {
                    addMember({groupId: groupId, username: adduser})
                    alert('User invited')
                  }}
                >Add Member</Button>
                <Button
                  colorScheme="red"
                  onPress={() => {
                    console.log('leave group')
                    leaveGroup({groupId:groupId})
                    navigate('Home')
                  }}
                >Leave Group</Button>
              {groupOwner === userId ? 
              <>
              <Button colorScheme="red" onPress={() => {
                deleteGroup({groupId:groupId})
                navigate('Home')
              }}>Delete Group</Button>
              <Button
                colorScheme="red"
                  onPress={() => {
                    removeMember({groupId: groupId, username: adduser})
                  }}
                >Remove Member</Button>
              </>
               : null}
              </VStack>
            </Modal.Body>
           
          </Modal.Content>
        </Modal>

      </HStack>
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
      </Box>
    </View>
  );
};

export default GroupChat;
