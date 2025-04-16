import api from '@/lib/axiosConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();

	const loginHandler = () => {
		api.post('/users/login', {
			email,
			password
		})
			.then((resp) => {
				console.log(resp.data);
				localStorage.setItem('token', resp.data.token);
				router.push('/dashboard');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			<video autoPlay loop muted playsInline className='fixed top-0 left-0 w-full h-full object-cover z-[-1]'>
				<source src='/videos/plane2.mp4' type='video/mp4' />
				Your browser does not support the video tag.
			</video>
			<div className='fixed top-0 left-0 w-full h-full bg-black/75 z-[-1]' />

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className='flex flex-col w-full h-full justify-center items-center'
			>
				<div className='flex flex-col items-center px-20 py-16 rounded-xl gap-6 border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur w-full max-w-[500px] '>
					<div className='flex flex-col items-center justify-center gap-2'>
						<p className='font-extrabold text-4xl text-white text-center'>Log in</p>
						<p className='font-merriweather text-lg text-neutral-300'>Let's pick up where you left off</p>
					</div>
					<div className='flex flex-col gap-4 w-full'>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm font-medium text-white'>Email</p>
							<input
								className='py-3 px-4 rounded-lg text-sm outline-none focus:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.2)]'
								type='email'
								placeholder='Enter your email address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></input>
							{/* <Input placeholder='Enter your email address' value={email} onChange={(e) => setEmail(e.target.value)} /> */}
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm font-medium text-white'>Password</p>
							<input
								className='py-3 px-4 rounded-lg text-sm outline-none focus:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.2)]'
								placeholder='Enter your password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></input>
							<p className='text-sm self-end text-neutral-300'>Forgot password?</p>
						</div>
					</div>
					<div className='flex flex-col items-center justify-center gap-4 w-full'>
						<button className='w-full bg-primary py-3 px-16 rounded-xl text-white font-bold hover:bg-[#8CB4FF]' onClick={loginHandler}>
							Log in
						</button>
						<p className='text-neutral-300 text-sm'>
							Don't have an account yet?{' '}
							<Link href='/signup' className='font-semibold underline-offset-2 text-pink hover:text-pinkhover2 hover:underline'>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default Login;
