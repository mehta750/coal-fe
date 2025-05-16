import Header from "../componets/Header";
import LazyLoadProducts from "../componets/LazyLoadProducts";
import { fetchRoutes } from "../routes";

export default function Products() {
    const Routres: any = fetchRoutes()
    return (
        <>
        <Header title={Routres.products}/>
        <LazyLoadProducts/>
        </>
    )
}