import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale, scale } from 'react-native-size-matters';
import { Colors } from '../constant';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
const AppModal = (props: Props) => {
    const { isVisible, onClose, children, } = props
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            useNativeDriver
            style={{ justifyContent: 'center', alignItems: 'center' }}
        >
            <View
                style={{
                    backgroundColor: 'white',
                    padding: moderateScale(20),
                    borderRadius: 10,
                    width: '80%',
                    position: 'relative',
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
        </Modal>
    )
}

export default AppModal