import { Outlet } from "react-router-dom";
import Navbar from "../components/navigational/Navbar";
import Footer from "../components/navigational/Footer";

export default function MainLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}