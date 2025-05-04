import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from '../componets/CustomText';
import Dropdown from '../componets/Dropdown';
import { Colors } from '../constant';
import { useLocalisation } from '../locales/localisationContext';
import { fetchRoutes } from '../routes';

const AuthLayout = () => {
    const Routes = fetchRoutes()
    const languages = [
        { label: 'EN', value: 'en' },
        { label: 'PUN', value: 'pa' },
        { label: 'HIN', value: 'hi' },
    ]
    const {t, setLang, lang} = useLocalisation()
    const ios: boolean = Platform.OS === "ios"
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primaryButtonColor,   // Active tab label color
                tabBarInactiveTintColor: Colors.secondaryButtonColor,
                tabBarStyle: {
                    height: ios ? verticalScale(80) : verticalScale(50),
                    position: ios ? 'static' : 'absolute',
                    bottom: verticalScale(12),
                    right: verticalScale(25),
                    left: verticalScale(25),
                    borderRadius: verticalScale(10),
                },
                headerTitle: "",
                headerLeft: () => {
                    return (
                        <View style={{
                            ...Platform.select({
                                ios: {
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4.65,
                                },
                                android: {
                                    elevation: 8
                                }
                            }),
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5
                        }}>
                            <Image
                                source={require('../assets/images/logo.png')}
                                style={{
                                    width: scale(36),
                                    height: verticalScale(34),
                                    marginLeft: scale(10),
                                    borderRadius: scale(50)
                                }}
                            />
                            <CustomText text={"Clean Ozone"} size={10} fontStyle="italic" color='green' />
                        </View>
                    )
                },
                headerRight: () => {
                    return <View style={{ paddingRight: moderateScale(10) }}><Dropdown mode='modal' w={54} round h={22} renderRightIcon={false} data={languages} setValue={setLang} value={lang}/></View>
                }
            }}

        >
            <Tabs.Screen name="contactus"
                options={{
                    title: Routes.contactus as any,
                    tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => <AntDesign name="contacts" size={focused ? 30 : 24} color={color} />,
                }} />
            <Tabs.Screen name="products"
                options={{
                    title: Routes.products as any,
                    tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => <FontAwesome name="product-hunt" size={focused ? 30 : 24} color={color} />
                }} />
            <Tabs.Screen name="login"
                options={{
                    title: Routes.login as any,
                    tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => <AntDesign name="login" size={focused ? 30 : 24} color={color} />
                }} />
        </Tabs>
    )
}

export default AuthLayout