import { JSX } from "react";
import Navbar from "./Navbar";

const Layout = ({ children } : {children: JSX.Element}) => {
    return (
        <div className="h-full flex flex-col">
            <Navbar/>
            {children}
        </div>
    );
}
 
export default Layout;