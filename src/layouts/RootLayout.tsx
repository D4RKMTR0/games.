import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

function RootLayout() {

    return (
        <>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
                <Nav />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
}

export default RootLayout;