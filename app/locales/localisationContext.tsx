import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from '../locales/i18';


export interface LocalisationProps {
    setLang: (lang: string) => void 
    lang: string
    t: (s: string) => void
}
const LocalisationContext = createContext<LocalisationProps>({
    setLang: () => {},
    lang: 'en',
    t: () => {}
})
export const useLocalisation = () => useContext(LocalisationContext)

const LocalisationContextProvider = ({ children }: any) => {
    const {t} = useTranslation()
    const [lang, setLang] = useState('en')

    useEffect(() => {
        i18next.changeLanguage(lang)
    }, [lang])
   
    const valueObj: LocalisationProps = {
        t,
        setLang,
        lang
    }
    return <LocalisationContext.Provider value={valueObj}>
        {children}
    </LocalisationContext.Provider>
}
export default LocalisationContextProvider