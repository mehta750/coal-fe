import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useRootNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors, TEXT } from '../constant';
import { useLocalisation } from '../locales/localisationContext';
import Dropdown from './Dropdown';

interface Props {
    title?: string | null
    isMenu?: boolean
    isLogoClickable?: boolean
}

const Header = (props: Props) => {
    const navigation = useRootNavigation()
    const router = useRouter();
    const { title = "App title", isMenu = true, isLogoClickable = true } = props
    const languages = [
        { label: 'ENG', value: 'en' },
        { label: 'PUN', value: 'pa' },
        { label: 'HIN', value: 'hi' },
    ]
    const { setLang, lang } = useLocalisation()
    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Pressable
                    onPress={() => isLogoClickable ? router.push('/') : null}
                    style={{
                        position: 'relative',
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                    }}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={{
                            width: scale(60),
                            height: verticalScale(60),
                            borderRadius: scale(50),
                        }}
                    />
                    <Text style={{
                        textShadowColor: 'lightgrey',
                        textShadowOffset: { width: scale(2), height: scale(2) },
                        textShadowRadius: moderateScale(1),
                        position: 'absolute',
                        fontSize: scale(10),
                        top: verticalScale(42),
                        color: Colors.primaryButtonColor,
                        fontStyle: 'italic'

                    }}>Clean Ozone</Text>
                </Pressable>
                <View style={{
                    flex: isMenu ? 2 : 3.8,
                    alignItems: 'center',
                    alignContent: 'center',
                }}>
                    <Text style={{
                        fontSize: TEXT.fontSize14,
                        ...Platform.select({
                            ios: {
                                shadowColor: 'grey',
                                shadowOffset: { width: 0, height: scale(4) },
                                shadowOpacity: scale(0.3),
                                shadowRadius: scale(4.65),
                            },
                            android: {
                                elevation: scale(8)
                            }
                        }),
                    }}>{title}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 10,
                }}>
                    <Dropdown mode='modal' w={54} round h={20} renderRightIcon={false} data={languages} setValue={setLang} value={lang} />
                    {isMenu && <Pressable onPress={() => navigation?.dispatch(DrawerActions.toggleDrawer())}>
                        <Feather name="menu" size={scale(18)} color={Colors.primaryButtonColor} />
                    </Pressable>}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: 'grey',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
            },
            android: {
                elevation: 8
            }
        }),
    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: verticalScale(50),
        paddingHorizontal: moderateScale(16),
        borderBottomWidth: scale(0.5),
        borderBottomColor: '#ccc',
        flexDirection: 'row',
    },
});

export default Header;
