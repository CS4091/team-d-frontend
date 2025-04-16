import { UserContext } from '@/lib/context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

const Navbar = () => {
	const router = useRouter();
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	const { user } = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setLoggedIn(true);
		}
		setLoading(false);
	}, [user]);

	const signOut = () => {
		localStorage.removeItem('token');
		router.replace('/login');
		setLoggedIn(false);
	};

	return (
		<div
			className='absolute z-10 h-16 w-full flex items-center justify-between px-12 py-8 text-primary font-bold'
			style={{
				backgroundColor: router.pathname == '/dashboard' ? 'white' : 'transparent',
				position: router.pathname == '/dashboard' ? 'absolute' : 'relative'
			}}
		>
			<div className='flex gap-16 items-center'>
				<Link href='/' className='rounded-xl hover:text-blue-300'>
					LOGO
				</Link>
				<Link href='/' className='rounded-xl hover:text-blue-300'>
					Home
				</Link>
				<Link href='/dashboard' className='rounded-xl hover:text-blue-300'>
					Dashboard
				</Link>
				<Link href='/history' className='rounded-xl hover:text-blue-300'>
					History
				</Link>
			</div>
			{!loading && (
				<div className='flex gap-2 items-center'>
					{!loggedIn && (
						<>
							<Link href='/login' className='px-5 py-2 rounded-xl hover:bg-[#E1F1FF]'>
								Log in
							</Link>
							<Link href='/signup' className='px-5 py-2 bg-primary text-white rounded-xl hover:bg-[#8CB4FF]'>
								Sign up
							</Link>
						</>
					)}
					{loggedIn && (
						<button className='px-5 py-2 bg-primary text-white rounded-xl hover:bg-[#8CB4FF]' onClick={signOut}>
							Sign out
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default Navbar;
