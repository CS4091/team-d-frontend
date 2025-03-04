import Link from "next/link";

const Navbar = () => {
    return (
        <div className="absolute z-10 bg-gradient-to-b from-black/50 via-black/17 to-black/0 h-12 w-full flex items-center justify-center px-12 py-8 gap-8 text-white font-bold">
            <Link href="/" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">Home</Link>
            <Link href="/routes" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">Routes</Link>
            <Link href="/" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">Inventory</Link>
            <Link href="/" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">Organizations</Link>
            <Link href="/" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">History</Link>
        </div>
    );
}
 
export default Navbar;