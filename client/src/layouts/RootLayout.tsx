import { Outlet, useLocation } from "react-router";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const noFooterRoutes = ["/auth/login", "/auth/signup"]

function RootLayout() {
    const location = useLocation()
    const showFooter = !noFooterRoutes.includes(location.pathname)

    return (
        <>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
                <Nav />
                <main className="flex-grow">
                    <Outlet />
                </main>
                {showFooter && <Footer />}
            </div>
        </>
    );
}

export default RootLayout