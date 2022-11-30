import React,{
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import BottomSheet,{
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import {
    View,
    IconButton,
    Icon,
    Text,
} from 'native-base';

const BtmSheet = (trigger:boolean) => {

  if(trigger===true){
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);
  }


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
    const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);


    return (
      <BottomSheetModalProvider>
        <BottomSheetModal 
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={{backgroundColor: 'white', height: '100%'}}>
            <Text>Bottom Sheet Modal</Text>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    )    
}
export default BtmSheet;
