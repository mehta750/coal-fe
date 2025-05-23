import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Platform, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import * as yup from 'yup';
import CustomButton from '../componets/Button';
import Center from '../componets/Center';
import CompanyTitle, { CompanyLogo } from '../componets/CompanyTitle';
import FormikTextInput from '../componets/FormikTextInput';
import Header from '../componets/Header';
import ScrollViewComponent from '../componets/ScrollViewComponent';
import Space from '../componets/Space';
import { useAuth } from '../context/AuthContext';
import { useLocalisation } from '../locales/localisationContext';
import { fetchRoutes } from '../routes';

const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Minimum 6 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character'),
  });

  const { onLogin, authState } = useAuth()
  const router = useRouter()
  const Routes:any = fetchRoutes()
  const {t} = useLocalisation()
  return (
    <>
    <Header isLogoClickable={false} isMenu={false} title={Routes.login}/>
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={schema}
      onSubmit={async (values) => {
        const { email, password } = values
        const result = await onLogin(email, password)
        if (result.accessToken)
          router.replace('/(main)')
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <ScrollViewComponent>
          <Center gap={28}>
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
            <Space />
            <FormikTextInput round width={300} name='email' label={t('email')} type={'email'} />
            <FormikTextInput round width={300} name='password' label={t('password')} type={'password'} />
            <CustomButton round={5} w={300} isLoading={authState?.isLoading || isSubmitting} h={32} onPress={handleSubmit} />
          </Center>
        </ScrollViewComponent>
      )}

    </Formik>
    </>
  )
}

export default Login