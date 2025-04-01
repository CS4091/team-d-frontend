import { Input } from '@/components/ui/input';
import api from '@/lib/axiosConfig';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';


const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

    const router = useRouter();

	const loginHandler = () => {
		api.post('/users', {
			email,
			password
		})
			.then((resp) => {
				console.log(resp.data);
				localStorage.setItem('token', resp.data.token);
                router.push('/dashboard')
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			<div className="absolute w-[100%] h-[100%] bg-[url('/Gradient.svg')] bg-center bg-no-repeat"></div>
			<div className='flex flex-col w-full h-full justify-center items-center'>
				<div className='flex flex-col items-center bg-white p-20 rounded-xl gap-10 shadow-[2px_3px_30px_10px_rgba(0,0,0,0.2)]'>
					<div className='flex flex-col items-center justify-center gap-2'>
						<p className='font-bold text-4xl'>Welcome back to ARRO</p>
						<p className='font-merriweather text-lg text-gray'>Let's pick up where you left off.</p>
					</div>
					<div className='flex flex-col gap-6 w-full'>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm'>Email</p>
							<Input placeholder='Enter your email address' value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm'>Password</p>
							<Input placeholder='Enter your password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
							<p className='text-sm self-end'>Forgot password?</p>

						</div>
					</div>
					<div className='flex flex-col items-center justify-center gap-4 w-full'>
						<button className='w-full bg-primary py-3 px-16 rounded-xl text-white font-bold shadow-[2px_4px_6px_0px_rgba(0,0,0,0.25)] hover:bg-[#8CB4FF]' onClick={loginHandler}>
							Log in
						</button>
						<p className='text-gray font-merriweather text-sm'>
							Don't have an account yet?{' '}
							<Link href='/signup' className='underline text-pink hover:text-pinkhover'>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
