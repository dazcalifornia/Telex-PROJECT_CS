import React,{
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
    StyleSheet
  } from 'react-native';
import {
  Modal,
  Text,
  Button,
  View,
} from 'native-base';
import BottomSheet from '@gorhom/bottom-sheet';

function  Logut() {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return(
  <View style={styles.container}>
  <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>

</View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Logut;
  
