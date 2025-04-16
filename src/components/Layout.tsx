import { UserProvider } from '@/lib/context';
import { JSX } from 'react';
import Navbar from './Navbar';
import { GlassNavbar } from './GlassNavbar';

const Layout = ({ children }: { children: JSX.Element }) => {
	return (
		<UserProvider>
			<div className='h-full flex flex-col'>
				{/* <Navbar /> */}
                <GlassNavbar/>
				{children}
			</div>
		</UserProvider>
	);
};

export default Layout;
