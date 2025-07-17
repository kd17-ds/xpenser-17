import { Outlet } from "react-router-dom";
import Navbar from "../components/navigational/Navbar";

export default function MainLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}