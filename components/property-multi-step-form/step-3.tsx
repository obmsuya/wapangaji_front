import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '../ui/Button'
import SlideTransition from '../slide-transition'
import { Text } from "@/components/ui/Text"
import FloorPlanDetails from '../new-property/floor-plan'

interface props {
    step: number
    nextStep: (step: number) => void
    prevStep: (step: number) => void
}

const StepThree: React.FunctionComponent<props> = ({ step, nextStep, prevStep }) => {
    return (
        <View className="border flex-1 justify-center items-center">
            <FloorPlanDetails />
            <View className="flex-row">
                <Button
                    onPress={() => prevStep(step)}
                >Previous</Button>
                <Button
                    onPress={() => nextStep(step)}
                >Next</Button>
            </View>
        </View>
    )
}

export default StepThree

const styles = StyleSheet.create({})