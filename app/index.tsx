import { Redirect } from 'expo-router';
import { useAuth } from './context/AuthContext';

function Index() {
  const {authState} = useAuth()
  if(authState?.authenticated) return <Redirect href={"/(main)"}/>
  return <Redirect href={"/(auth)/login"}/>
}

export default Index
