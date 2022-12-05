import React,{
  useState,
  useEffect,
} from 'react';


import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const getPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
  }
};

export const pickImage = async () => {
  await getPermission();
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    return console.log(result.uri);
  }
}
