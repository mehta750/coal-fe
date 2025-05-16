import ContactusComponent from "../componets/ContactusComponent";
import Header from "../componets/Header";
import { fetchRoutes } from "../routes";

export default function Contactus() {
    const Rooutes:any = fetchRoutes()
    return (
        <>
            <Header title={Rooutes.contactus}/>
            <ContactusComponent/>
        </>
    )
}