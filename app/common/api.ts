import axios, { AxiosResponse } from "axios";
import Constants from 'expo-constants';
import { useGetApi } from "../helper/api";

const { 
    baseURL, 
    rawMaterialURL, 
    partiesURL,
    products,
    product,
    partyURL,
    loginURL,
    roleURL,
    tokenKey,
    rawMaterialPurchaseURL,
    payments,
    wastage,
    expenses,
    sale,
    sales,
    challenges,
    rawmaterials,
    refreshTokenURL,
    challengesState,
    closeChallengeState,
    user_information_url,
    wastage_available_quantity,
    outstanding_party_amount,
    raw_material_quantity,
    average_cost,
    manageInfo,
    rawmaterial
} = Constants?.expoConfig?.extra as any

export const useRawMaterialFetch = () => useGetApi(baseURL+rawmaterials)
export const usePartiesFetch = () => useGetApi(baseURL+partiesURL)
export const getFetchApi = async(url: string): Promise<AxiosResponse<any, any> | string> => {
    try {
        return await axios.get(url)
    } catch (err: any) {
        return (err?.response?.data.detail || err.message) || "something went wrong"
    }
}

export const postAPI = async(url: string, payload: any): Promise<AxiosResponse<any, any> | string> => {
    try {
        return await axios.post(url, payload)
    } catch (err: any) {
        return (err?.response?.data.detail || err.message) || "something went wrong"
    }
}

const API = {
      loginURL: baseURL+loginURL,
      roleURL: baseURL+roleURL,
      tokenKey,
      rawMaterialURL: baseURL+rawMaterialURL, 
      partiesURL: baseURL+partiesURL, 
      products: baseURL+products, 
      partyURL: baseURL+partyURL, 
      rawMaterialPurchaseURL: baseURL+rawMaterialPurchaseURL,
      payments: baseURL+payments,
      wastage: baseURL+wastage,
      expenses: baseURL+ expenses,
      sale: baseURL+ sale,
      sales: baseURL+ sales,
      challenges: baseURL+ challenges,
      refreshTokenURL: baseURL+refreshTokenURL,
      challengesState: baseURL+challengesState,
      closeChallengeState: baseURL+closeChallengeState,
      user_information_url: baseURL+user_information_url,
      wastage_available_quantity: baseURL+wastage_available_quantity,
      outstanding_party_amount: baseURL+outstanding_party_amount,
      raw_material_quantity: baseURL+raw_material_quantity,
      average_cost: baseURL+average_cost,
      manageInfo: baseURL+manageInfo,
      product: baseURL+product,
      rawmaterials: baseURL+rawmaterials,
      rawmaterial: baseURL+rawmaterial
}
export default API