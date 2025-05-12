import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Clean Ozone',
  slug: 'Coal',
  version: '1.0.0',
  icon: "./app/assets/images/logo.png",
  splash: {
    image: "./app/assets/images/logo.png",
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  platforms: ['ios', 'android'],
  ios: {
    bundleIdentifier: "com.cleanozone.Coal",
    supportsTablet: true,
  },
  extra: {
    eas: {
      projectId: "f6a4c68d-6374-4edc-bf8e-f1019b9c5311"
    },
    baseURL: process.env.BASE_URL,
    loginURL: process.env.API_LOGIN_URL,
    roleURL: process.env.API_ROLE,
    tokenKey: process.env.TOKEN_KEY,
    rawMaterialURL: process.env.API_RAWMATERIAL, 
    partiesURL: process.env.API_PARTIES, 
    products: process.env.API_PRODUCTS, 
    partyURL: process.env.API_PARTY, 
    rawMaterialPurchaseURL: process.env.API_RAWMATERIALPURCHASE,
    rawMaterialQuantityURL:process.env.API_RAWMATERIALQUANTITY,
    rawmaterials:process.env.API_RAWMATERIALS,
    product:process.env.API_PRODUCT,
    plant:process.env.API_PLANT,
    expenses:process.env.API_EXPENSE,
    payments: process.env.API_PAYMENTS,
    wastage: process.env.API_WASTAGE,
    sale: process.env.API_SALE,
    sales: process.env.API_SALES,
    challenges: process.env.API_CHALLENGES,
    refreshTokenURL: process.env.API_REFRESH_TOKEN_URL,
    challengesState: process.env.API_CHALLENGESSTATE,
    closeChallengeState: process.env.API_CLOSECHALLENGESTATE,
    user_information_url:process.env.API_USER_INFORMATION,
    wastage_available_quantity:process.env.API_WASTAGE_AVAILABLE_QUANTITY,
    outstanding_party_amount: process.env.API_OUTSTANDING_PARTY_AMOUNT,
    raw_material_quantity:process.env.API_RAWMATERIAL_QUANTITY,
    average_cost: process.env.API_AVERAGE_COST
  },
  android: {
    package: "com.cleanozone.Coal",
    adaptiveIcon: {
      foregroundImage: "./app/assets/images/logo.png"
    },
  },
});

