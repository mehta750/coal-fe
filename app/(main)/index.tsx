import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../componets/CustomText";
import Space from "../componets/Space";
import { Colors } from "../constant";
import { AuthProps, useAuth } from "../context/AuthContext";
import { fetchRoutes } from "../routes";

export default function Dashboard() {
    const routesObj = fetchRoutes()
    let routes: any = {...routesObj}
    const {onLogout, authState} = useAuth() as AuthProps
    const role = authState?.role
    if(role?.includes('partner')){
        const {reporting, ...restRoutes} = routesObj
        routes = restRoutes
    }
    
    const dataList = Object.entries(routes)
        .filter(([route]) => !route.includes('login') && !route.includes('dashboard'))
        .map(([route, label]) => ({
            route,
            label
        }));
    const router = useRouter()

    
      useEffect(() => {
        if(!authState?.authenticated)
          router.replace('/(auth)/login')
      },[authState?.authenticated])

    const handleCardPress = useCallback(async (item: any) => {
        if(item.label === 'Logout')
            await onLogout()
        else router.replace(`/${item.route}` as any)
    },[])
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} onPress={() =>handleCardPress(item)}>
            <Text style={styles.cardText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View
                style={{
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
                    alignItems: 'center', gap: moderateScale(10)
                }}
            >
                <Image
                    source={require('../assets/images/logo.png')}
                    style={{
                        width: scale(64),
                        height: verticalScale(60),
                        borderRadius: scale(50),
                    }}
                />
                <CustomText
                    size={10}
                    text="Clean Ozone"
                    fontStyle="italic"
                    color={Colors.primaryButtonColor}
                />
            </View>
            <Space h={36}/>
            <FlatList
                data={dataList}
                renderItem={renderItem}
                keyExtractor={(item) => item.route}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(10),
        backgroundColor: '#f2f2f2',
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        margin: scale(8),
        padding: moderateScale(20),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // For Android
        shadowColor: '#000', // For iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    cardText: {
        color: Colors.primaryButtonColor,
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});