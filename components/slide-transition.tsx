import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn, FadeOut, FadeInRight, FadeOutRight } from 'react-native-reanimated'

interface Props {
    children: React.ReactNode
}

const SlideTransition = ({ children }: Props) => {
    return (
        <Animated.View entering={FadeInRight} exiting={FadeOutRight} style={{flex: 1}}>
            {children}
        </Animated.View>
    )
}

export default SlideTransition

const styles = StyleSheet.create({})