import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useRootNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors, TEXT } from '../constant';
import { useLocalisation } from '../locales/localisationContext';
import CompanyTitle, { CompanyLogo } from './CompanyTitle';
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
                    <CompanyLogo />
                    <CompanyTitle/>
                </Pressable>
                <View style={{
                    flex: isMenu ? 2 : 3.8,
                    alignItems: 'center',
                    alignContent: 'center',
                }}>
                    <Text style={{
                        color: Colors.primaryButtonColor,
                        fontSize: TEXT.fontSize18,
                        fontWeight: '600',
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
                    <Dropdown selectedColor={Colors.primaryButtonColor} borderColor={Colors.primaryButtonColor} mode='modal' w={58} round h={21} renderRightIcon={false} data={languages} setValue={setLang} value={lang} />
                    {isMenu && <Pressable onPress={() => navigation?.dispatch(DrawerActions.toggleDrawer())}>
                        <Feather name="menu" size={RFValue(18)} color={Colors.primaryButtonColor} />
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
