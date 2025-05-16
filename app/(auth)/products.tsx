import Header from "../componets/Header";
import LazyLoadProducts from "../componets/LazyLoadProducts";
import { fetchRoutes } from "../routes";

export default function Products() {
    const Routes:any = fetchRoutes()
    return (
        <>
        <Header  isLogoClickable={false} isMenu={false} title={Routes.products}/>
        <LazyLoadProducts/>
        </>
    )
}