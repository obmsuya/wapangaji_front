import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../ui/Button'
import SlideTransition from '../slide-transition'

interface props {
    step: number
    prevStep: (step: number) => void
}

const StepFour: React.FunctionComponent<props> = ({ step, prevStep }) => {
    return (
        <View>
            <Text> StepFour</Text>
            <Button
                onPress={() => prevStep(step)}
            >Previous</Button>
        </View>
    )
}

export default StepFour

const styles = StyleSheet.create({})