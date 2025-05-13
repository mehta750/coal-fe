import { useLocalisation } from "../locales/localisationContext"

export const Routes = {
    dashboard: 'Dashboard',
    login: "Login",
    products: 'Products',
    contactus: "Contactus",
    rawMaterial: "Raw Material",
    payments: "Payments",
    expenses: "Expenses",
    reporting: "Reporting",
    wastage: "Wastage",
    challenges: "Challenges",
    sale: "Sale",
    logout: "Logout"
}

export const fetchRoutes = () => {
    const { t } = useLocalisation()
    return {
        dashboard: t('dashboard'),
        login: t('login'),
        products: t('products'),
        contactus: t('contactus'),
        rawMaterial: t('rawMaterial'),
        payments: t('payments'),
        expenses: t('expenses'),
        reporting: t('reporting'),
        wastage: t('wastage'),
        challenges: t('challenges'),
        sale: t('sales'),
        logout: t('logout')
    }
}

const routes ={Routes, fetchRoutes}
export default routes