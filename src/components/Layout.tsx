import { UserProvider } from '@/lib/context';
import { JSX } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: { children: JSX.Element }) => {
	return (
		<UserProvider>
			<div className='h-full flex flex-col'>
				<Navbar />
				{children}
			</div>
		</UserProvider>
	);
};

export default Layout;
