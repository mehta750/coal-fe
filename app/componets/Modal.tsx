import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import { Colors } from '../constant';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
const height = Dimensions.get('screen').height
const AppModal = (props: Props) => {
    const { isVisible, onClose, children} = props
    return (
        <Modal
            avoidKeyboard={true}
            propagateSwipe={true}
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            useNativeDriver
            style={{ justifyContent: 'center', alignItems: 'center' }}
        >
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
            <View
                style={{
                    backgroundColor: 'white',
                    padding: moderateScale(20),
                    borderRadius: 10,
                    width: "80%",
                    height: height * 0.6
                }}
            >
                {/* Corner Close Button */}
                <Pressable
                    onPress={onClose}
                    style={{
                        position: 'absolute',
                        top: moderateScale(10),
                        right: moderateScale(10),
                        zIndex: 1,
                    }}
                >
                    <Feather name="x" size={scale(20)} color={Colors.textBlackColor} />
                </Pressable>
                {children}
            </View>
            </SafeAreaView> 
        </Modal>
    )
}

export default AppModal