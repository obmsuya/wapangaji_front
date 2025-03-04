import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../ui/Button'
import SlideTransition from '../slide-transition'
import { UnitDetails } from '../new-property/unit-details'
import { useUnitStore } from '@/lib/zustand'

interface props {
    step: number
    prevStep: (step: number) => void
}

const StepFour: React.FunctionComponent<props> = ({ step, prevStep }) => {
    const { totalFloors } = useUnitStore()
    return (
        <View>
            <UnitDetails
                onNext={() => console.log("Next")}
                onBack={() => console.log("Prev")} />
            <Button
                onPress={() => prevStep(step)}
            >Previous</Button>
        </View>
    )
}

export default StepFour

const styles = StyleSheet.create({})