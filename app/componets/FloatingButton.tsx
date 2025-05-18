import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { moderateScale, scale } from 'react-native-size-matters'
import { Colors } from '../constant'

interface Props {
    onPress?: () => void
}
const FloatingButton = (props: Props) => {

    const screenHeight = Dimensions.get('window').height;
    const halfScreenHeight = screenHeight * 0.1;
    const { onPress } = props
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                zIndex: 999,
                position: 'absolute',
                bottom: halfScreenHeight,
                right: moderateScale(20),
                height: scale(40),
                width: scale(40),
                backgroundColor: Colors.primaryButtonColor,
                borderRadius: moderateScale(50),
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 6,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 4 },
            }}
        >
           <AntDesign name="plus" size={24} color={'white'} />
        </TouchableOpacity>

    )
}

export default FloatingButton