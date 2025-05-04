import React, { memo, ReactElement } from 'react';
import { ActivityIndicator, Platform, Pressable, Text } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant';
import { useLocalisation } from '../locales/localisationContext';

interface Props {
    label?: string | ReactElement | any
    onPress?: () => void
    bg?: string
    color?: string
    w?: any
    p?: any
    round?: number
    size?: number
    h?: number | null
    disabled?: boolean
    isLoading?: boolean

}

const CustomButton = (props: Props) => {
    const {t} = useLocalisation()
    const {
        round = 0,
        onPress,
        label = t('submit'),
        bg = Colors.primaryButtonColor,
        color = Colors.textWhiteColor,
        w = 100,
        p = 6,
        size = 13,
        h = null,
        disabled = false,
        isLoading = false
    } = props
    return (
        <Pressable
            disabled={disabled || isLoading}
            onPress={onPress}
            style={{
                ...Platform.select({
                    android: {
                        elevation: 10,
                    },
                    ios: {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                    }
                }),
                width: scale(w),
                height: h ? verticalScale(h) : 'auto',
                backgroundColor: disabled ? Colors.disableColor : bg,
                padding: moderateScale(p),
                borderRadius: scale(round),
                justifyContent: "center",
                alignItems: "center",

            }}>
            <Text style={{
                color: disabled ? Colors.secondaryButtonColor : color,
                fontSize: scale(size)
            }}>
                {isLoading ? <ActivityIndicator color={"white"} /> : label}

            </Text>
        </Pressable>
    )
}

export default memo(CustomButton)
