import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';

const Signup = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');

	const [videoLoaded, setVideoLoaded] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const { updateUser } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		const video = videoRef.current;

		if (video?.readyState! >= 3) {
			setVideoLoaded(true);
		} else {
			const handleLoaded = () => setVideoLoaded(true);
			video?.addEventListener('loadeddata', handleLoaded);

			return () => {
				video?.removeEventListener('loadeddata', handleLoaded);
			};
		}
	}, []);

	const signupHandler = () => {
		if (confirmPassword != password) {
			setError('Passwords do not match');
			return;
		}
		api.post('/users/register', {
			name,
			email,
			password,
		})
			.then((resp) => {
				localStorage.setItem('token', resp.data.token);
				updateUser();
				router.push('/dashboard');
			})
			.catch((err) => {
				console.log(err);
				setError(err.response.data.message);
			});
	};

	return (
		<>
			<motion.video
				ref={videoRef}
				autoPlay
				loop
				muted
				playsInline
				initial={{ opacity: 0 }}
				animate={{ opacity: videoLoaded ? 1 : 0 }}
				transition={{ duration: 1.2, ease: 'easeOut' }}
				className="fixed top-0 left-0 w-full h-full object-cover z-[0]"
			>
				<source src="/videos/plane2.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</motion.video>

			<motion.div
				initial={{ opacity: 1 }}
				animate={{ opacity: videoLoaded ? 0.75 : 1 }}
				transition={{ duration: 1 }}
				className="fixed top-0 left-0 w-full h-full bg-black z-[0]"
			/>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className="flex flex-col w-full h-full justify-center items-center"
			>
				<div className="flex flex-col items-center p-20 py-16 rounded-xl gap-6 border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur w-full max-w-[600px] ">
					<div className="flex flex-col items-center justify-center gap-2">
						<p className="font-extrabold text-4xl text-white text-center">Sign up</p>
						<p className="font-merriweather text-lg text-neutral-300">Let's get started by creating an account</p>
						{error != '' && <p className="text-sm text-red-400 font-bold">Error: {error}</p>}
					</div>
					<div className="flex flex-col gap-4 w-full">
						{/* Row 1: Name and Email */}
						<div className="flex flex-col md:flex-row gap-4 w-full">
							<div className="flex flex-col gap-2 w-full md:w-1/2">
								<p className="text-sm font-medium text-white">Name</p>
								<input
									className="w-full py-3 px-4 rounded-lg text-sm outline-none focus:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.2)]"
									placeholder="Enter your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								></input>
							</div>
							<div className="flex flex-col gap-2 w-full md:w-1/2">
								<p className="text-sm font-medium text-white">Email</p>
								<input
									className="w-full py-3 px-4 rounded-lg text-sm outline-none focus:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.2)]"
									placeholder="Enter your email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								></input>
							</div>
						</div>

						{/* Row 2: Password and Confirm Password */}
						<div className="flex flex-col md:flex-row gap-4 w-full">
							<div className="flex flex-col gap-2 w-full md:w-1/2">
								<p className="text-sm font-medium text-white">Password</p>
								<input
									className="w-full py-3 px-4 rounded-lg text-sm outline-none focus:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.2)]"
									placeholder="Enter your password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								></input>
							</div>
							<div className="flex flex-col gap-2 w-full md:w-1/2">
								<p className="text-sm font-medium text-white">Confirm Password</p>
								<input
									className="w-full py-3 px-4 rounded-lg text-sm outline-none focus:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.2)]"
									placeholder="Confirm your password"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								></input>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center gap-4 w-full">
						<button className="w-full bg-primary py-3 px-16 rounded-xl text-white font-bold hover:bg-[#8CB4FF]" onClick={signupHandler}>
							Sign up
						</button>
						<p className="text-neutral-300 text-sm">
							Already have an account?{' '}
							<Link href="/login" className="font-semibold underline-offset-2 text-pink hover:text-pinkhover2 hover:underline">
								Log in
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default Signup;
