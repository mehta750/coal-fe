import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale, scale } from "react-native-size-matters";
import CompanyTitle, { CompanyLogo } from "../componets/CompanyTitle";
import Header from "../componets/Header";
import Space from "../componets/Space";
import { Colors } from "../constant";
import { AuthProps, useAuth } from "../context/AuthContext";
import { fetchRoutes } from "../routes";

export default function Dashboard() {
    const routesObj = fetchRoutes()
    let routes: any = { ...routesObj }
    const { onLogout, authState } = useAuth() as AuthProps
    const role = authState?.role
    if (role?.includes('partner')) {
        const { reporting, ...restRoutes } = routesObj
        routes = restRoutes
    }

    const dataList = Object.entries(routes)
        .filter(([route]) => !route.includes('login') && !route.includes('dashboard') && !route.includes('logout'))
        .map(([route, label]) => ({
            route,
            label
        }));
    const router = useRouter()


    useEffect(() => {
        if (!authState?.authenticated)
            router.replace('/(auth)/login')
    }, [authState?.authenticated])

    const handleCardPress = useCallback(async (item: any) => {
        if (item.label === 'Logout')
            await onLogout()
        else router.replace(`/${item.route}` as any)
    }, [])
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
            <Text allowFontScaling style={styles.cardText}>{item.label}</Text>
        </TouchableOpacity>
    );
    return (
        <>
            <Header title={null} />
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
                    <CompanyLogo h={56} />
                    <CompanyTitle position="static" size={26} />
                </View>
                <Space h={36} />
                <FlatList
                    data={dataList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.route}
                    numColumns={2}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </>
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
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    cardText: {
        color: Colors.primaryButtonColor,
        fontSize: RFValue(16),
        fontWeight: '600',
    },
});