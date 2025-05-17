import { Feather } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useRootNavigation, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import {
  Image,
  Platform,
  Pressable,
  View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from '../componets/CustomText';
import Dropdown from '../componets/Dropdown';
import { Colors, TEXT } from '../constant';
import { useAuth } from '../context/AuthContext';
import { useLocalisation } from '../locales/localisationContext';
import { fetchRoutes } from '../routes';

export default function DrawerLayout() {
  const Routes: any = fetchRoutes();

  const routesNameArray = [
    { name: 'index', title: '', label: Routes.dashboard },
    { name: 'products', title: Routes.products },
    { name: 'contactus', title: Routes.contactus },
    { name: 'rawMaterial', title: Routes.rawMaterial },
    { name: 'wastage', title: Routes.wastage },
    { name: 'expenses', title: Routes.expenses },
    { name: 'payments', title: Routes.payments },
    { name: 'sale', title: Routes.sale },
    { name: 'challenges', title: Routes.challenges },
    { name: 'reporting', title: Routes.reporting },
  ];

  const router = useRouter();
  const navigateHome = () => {
    router.push('/');
  };

  const languages = [
    { label: 'EN', value: 'en' },
    { label: 'PUN', value: 'pa' },
    { label: 'HIN', value: 'hi' },
  ];

  const { t, setLang, lang } = useLocalisation();
  const navigation = useRootNavigation();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.primaryButtonColor,
        headerTintColor: Colors.primaryButtonColor,
        headerTitleAlign: 'center',
        drawerPosition: 'right',
        drawerLabelStyle: {
          fontSize: TEXT.fontSize13,
        },
        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              gap: moderateScale(12),
              marginRight: scale(10),
              alignItems: 'center',
            }}
          >
            <Dropdown
              mode="modal"
              w={54}
              round
              h={22}
              renderRightIcon={false}
              data={languages}
              setValue={setLang}
              value={lang}
            />
            <Pressable onPress={() => navigation?.dispatch(DrawerActions.toggleDrawer())}>
              <Feather name="menu" size={scale(24)} color={Colors.primaryButtonColor} />
            </Pressable>
          </View>
        ),
        headerLeft: () => (
          <Pressable
            onPress={navigateHome}
            style={{
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                },
                android: {
                  elevation: 8,
                },
              }),
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginLeft: scale(10),
            }}
          >
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                width: scale(36),
                height: verticalScale(34),
                borderRadius: scale(50),
              }}
            />
            <CustomText
              size={10}
              text="Clean Ozone"
              fontStyle="italic"
              color={Colors.primaryButtonColor}
            />
          </Pressable>
        ),
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {routesNameArray.map(({ name, title, label }) => (
        <Drawer.Screen
          key={name}
          name={name}
          options={{
            drawerLabel: label,
            title: title,
          }}
        />
      ))}
    </Drawer>
  );
}

function CustomDrawerContent(props:any) {
  const {t} = useLocalisation() as any
  const {onLogout} = useAuth()
  const handleLogout = async () => {
      await onLogout()
  };
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <DrawerItemList {...props} />
      </View>

      <View style={{ borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: moderateScale(10) }}>
        <DrawerItem
          label={t('logout')}
          labelStyle={{ fontSize: TEXT.fontSize13, color: Colors.textErrorColor }}
          icon={({ size }) => (
            <Feather name="log-out" size={size} color={Colors.textErrorColor} />
          )}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}
