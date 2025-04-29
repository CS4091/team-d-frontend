import { UserProvider } from '@/lib/context';
import { JSX } from 'react';
import { GlassNavbar } from './GlassNavbar';
import { ToastContainer } from 'react-toastify';

const Layout = ({ children }: { children: JSX.Element }) => {
	return (
		<UserProvider>
			<div className='h-full flex flex-col'>
				{/* <Navbar /> */}
                <GlassNavbar/>
				{children}
			</div>
            <ToastContainer />
		</UserProvider>
	);
};

export default Layout;
