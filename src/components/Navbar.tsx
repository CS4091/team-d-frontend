import Link from 'next/link';
import { MdAccountCircle } from 'react-icons/md';

const Navbar = () => {
	return (
		<div className="absolute z-10 bg-gradient-to-b from-black/50 via-black/17 to-black/0 h-12 w-full flex items-center justify-between px-12 py-8 text-white font-bold">
			<div className=''></div>
			<div className='w-full flex justify-center gap-8'>
				<Link href="/" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">
					Home
				</Link>
				<Link href="/routes" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">
					Routes
				</Link>
				<Link href="/" className="px-3 py-2 rounded-xl drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] hover:bg-gray-700/20">
					History
				</Link>
			</div>
			<MdAccountCircle size={32} className="ml-auto cursor-pointer" />
		</div>
	);
};

export default Navbar;
