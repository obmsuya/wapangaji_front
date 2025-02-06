import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const index = () => {
    const [stepOne, nextStepOne] = React.useState(false)
    const [stepTwo, nextStepTwo] = React.useState(false)
    const [stepThree, nextStepThree] = React.useState(false)
    const [stepFour, nextStepFour] = React.useState(false)


  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})