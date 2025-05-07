import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserContext } from '@/lib/context';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import useMeasure from 'react-use-measure';
import Logo from './assets/Logo';
import { Button } from './ui/button';
import api from '@/lib/axiosConfig';
import { toast } from 'react-toastify';

export const GlassNavbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const router = useRouter();
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	const { user, updateUser } = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setLoggedIn(true);
		}
		setLoading(false);
	}, [user]);

	const signOut = () => {
		router.replace('/login');
		localStorage.removeItem('token');
		localStorage.removeItem('selectedOrganization');
		updateUser();
		setLoggedIn(false);
	};

	const acceptInvite = (token: string, name: string) => {
		api.post('/organizations/accept-invite', { token })
			.then((resp) => {
				console.log(resp.data);
				updateUser();
				toast(`You have successfully joined ${name}!`, { type: 'success' });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const declineInvite = (token: string) => {
		api.post('/organizations/decline-invite', {
			token: token,
		})
			.then((resp) => {
				updateUser();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<motion.nav
			initial={{ y: -40, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className="fixed left-0 right-0 top-0 mx-auto max-w-6xl overflow-hidden border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:left-6 md:right-6 md:top-6	 md:rounded-3xl z-[48] h-14"
		>
			<div className="flex items-center justify-between px-4 py-2">
				<div className="hidden items-center gap-2 md:flex">
					<GlassLink text="Home" href="/" />
					{loggedIn && <GlassLink text="Dashboard" href="/dashboard" />}
					{/* {loggedIn && <><GlassLink text='History' href='/history' /></>} */}
				</div>
				<LogoBox />
				{!loading && (
					<div className="flex items-center gap-4">
						{!loggedIn ? (
							<>
								<SignInButton />

								<Link
									className="relative scale-100 overflow-hidden rounded-lg bg-gradient-to-br from-primary from-40% to-[#8FB1F0] px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95"
									href="/signup"
								>
									Sign up
								</Link>
							</>
						) : (
							<>
								<DropdownMenu>
									<DropdownMenuTrigger className="outline-none">
										<div
											className="rounded-full p-2 
                                        inset-0 z-0 hover:bg-gradient-to-br from-white/20 to-white/5 transition-all group-hover:opacity-100 hover:scale-105 active:scale-95"
										>
											<Bell color="white" className="group relative" strokeWidth={1.5} />
											{user?.activeInvites.length > 0 && <div className="bg-red-400 rounded-full h-2 w-2 absolute top-2 right-3"></div>}
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-96">
										<DropdownMenuLabel className="text-lg pl-4">Notifications</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{user?.activeInvites.length == 0 && <p className="px-4 py-2 font-medium text-center">You have no new notifications</p>}
										{user?.activeInvites.map((inv) => (
											<>
												<div key={inv.token} className="px-4 py-2 gap-4 flex flex-col">
													<div className="flex flex-col justify-center">
														<p className="font-semibold">You have been invited to join {inv.organization.name}</p>
														<p className="text-sm text-neutral-500 font-merriweather">
															{new Date(inv.createdAt).toLocaleString()}
														</p>
													</div>
													<div className="flex gap-2 w-full">
														<Button variant={'destructive'} className="w-full" onClick={() => declineInvite(inv.token)}>
															Decline
														</Button>
														<Button className="w-full" onClick={() => acceptInvite(inv.token, inv.organization.name)}>
															Accept
														</Button>
													</div>
												</div>
												<DropdownMenuSeparator />
											</>
										))}
									</DropdownMenuContent>
								</DropdownMenu>

								<button
									className="relative scale-100 overflow-hidden rounded-3xl bg-gradient-to-br from-primary from-40% to-[#8FB1F0] px-3 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95"
									onClick={signOut}
								>
									Sign out
								</button>
							</>
						)}

						<button
							onClick={() => setMenuOpen((pv) => !pv)}
							className="ml-2 block scale-100 text-3xl text-white/90 transition-all hover:scale-105 hover:text-white active:scale-95 md:hidden"
						>
							<FiMenu />
						</button>
					</div>
				)}
			</div>

			<MobileMenu menuOpen={menuOpen} />
		</motion.nav>
	);
};

const LogoBox = () => (
	<span className="pointer-events-none left-0 top-[50%] z-10 flex text-4xl font-black text-white md:absolute md:left-[50%] md:-translate-x-[50%] md:-translate-y-[50%]">
		<Logo className="h-10 w-10 text-primary" />
		arro
	</span>
);

const GlassLink = ({ text, href }: { text: string; href: string }) => {
	return (
		<Link href={href} className="group relative scale-100 overflow-hidden rounded-lg px-4 py-2 transition-transform hover:scale-105 active:scale-95">
			<span className="relative z-10 text-white/90 transition-colors font-semibold group-hover:text-white group-hover:font-bold">{text}</span>
			<span className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
		</Link>
	);
};

const TextLink = ({ text }: { text: string }) => {
	return (
		<a href="#" className="text-white/90 transition-colors hover:text-white">
			{text}
		</a>
	);
};

const SignInButton = () => {
	return (
		<Link href={'/login'} className="group relative scale-100 overflow-hidden rounded-lg px-4 py-2 transition-transform hover:scale-105 active:scale-95">
			<span className="relative z-10 text-white/90 transition-colors font-semibold group-hover:text-white group-hover:font-bold">Log in</span>
			<span className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
		</Link>
	);
};

const MobileMenu = ({ menuOpen }: { menuOpen: boolean }) => {
	const [ref, { height }] = useMeasure();
	return (
		<motion.div
			initial={false}
			animate={{
				height: menuOpen ? height : '0px',
			}}
			className="block overflow-hidden md:hidden"
		>
			<div ref={ref} className="flex items-center justify-between px-4 pb-4">
				<div className="flex items-center gap-4">
					<TextLink text="Products" />
					<TextLink text="History" />
					<TextLink text="Contact" />
				</div>
			</div>
		</motion.div>
	);
};

export default GlassNavbar;
