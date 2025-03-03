import Link from "next/link";

const Navbar = () => {
    return (
        <div className="bg-white h-12 w-full flex items-center px-12 py-8 gap-12">
            <Link href="/">Home</Link>
            <Link href="/">Routes</Link>
            <Link href="/">Inventory</Link>
            <Link href="/">Organizations</Link>
            <Link href="/">History</Link>
        </div>
    );
}
 
export default Navbar;