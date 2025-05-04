import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

SplashScreen.preventAutoHideAsync()
function Index() {
  const {authState} = useAuth()
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  if(authState?.authenticated) return <Redirect href={"/(main)"}/>
  return <Redirect href={"/(auth)/login"}/>
}

export default Index
