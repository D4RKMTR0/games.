import { Outlet, useLocation } from "react-router";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { useTheme } from "../hooks/useTheme";
import LoginModal from "../components/ui/LoginModal";
import { useState } from "react";

const noFooterRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/user/settings"]

function RootLayout() {
    const location = useLocation()
    const showFooter = !noFooterRoutes.includes(location.pathname)

    const [loginOpen, setLoginOpen] = useState(false)

    return (
        <>  
            {useTheme()}
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
                <Nav />
                <main className="grow">
                    <Outlet context={{ setLoginOpen }} />
                </main>
                {showFooter && <Footer />}
                <LoginModal
                    open={loginOpen}
                    onClose={() => setLoginOpen(false)}
                />
            </div>
        </>
    );
}

export default RootLayout