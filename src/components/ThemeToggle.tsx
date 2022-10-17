import { HStack, Switch, Text, useColorMode } from 'native-base'
import React from 'react'

const ThemeToggle = () => {
    const {colorMode, toggleColorMode}= useColorMode();
  return (
    <HStack space={3} alignItems="center">
        <Text>ThemeToggle</Text>
        <Switch 
        isChecked={colorMode === 'dark'}
        onToggle={toggleColorMode} />
        <Text>{colorMode}</Text>
    </HStack>
  )
}

export default ThemeToggle