import React,{
  useState,
  useEffect,
} from 'react';

import firebase from 'firebase/compat/app';
import {storage} from '../../../firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const getPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
  }
};
export const uploadImage = async (uri:string, chatId:string) => {
    const imageUri  = uri;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      }
      xhr.onerror = function(e) {
        reject(new TypeError('Network request failed'));
      }
      xhr.responseType = 'blob';
      xhr.open('GET', imageUri, true);
      xhr.send(null);
    });
    const ref = storage.ref().child(`chatImage/${new Date().getTime()}`);
    const snapshot = await ref.put(blob);
    blob.close();
    const url = await snapshot.ref.getDownloadURL();
    console.log('url',url)
    return url;
};

export const pickImage = async () => {
  await getPermission();
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    //const url = result.uri;
    const url = await uploadImage(result.uri);
    console.log('url',url)
    return url;
  }
}

