import { Input } from '@/components/ui/input';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

const Signup = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');

	const { updateUser } = useContext(UserContext);

	const router = useRouter();

	const signupHandler = () => {

		if (confirmPassword != password) {
			setError('Passwords do not match');
			return;
		}
		api.post('/users/register', {
			name,
			email,
			password
		})
			.then((resp) => {
				localStorage.setItem('token', resp.data.token);
                updateUser()
				router.push('/dashboard');
			})
			.catch((err) => {
				console.log(err);
				setError(err.response.data.message);
			});
	};

	return (
		<>
			<div className="absolute w-[100%] h-[100%] bg-[url('/Gradient.svg')] bg-center bg-no-repeat"></div>
			<div className='flex flex-col w-full h-full justify-center items-center'>
				<div className='flex flex-col items-center bg-white p-20 rounded-xl gap-10 shadow-[2px_3px_30px_10px_rgba(0,0,0,0.2)]'>
					<div className='flex flex-col items-center justify-center gap-2'>
						<p className='font-bold text-4xl'>Get Started With ARRO</p>
						<p className='font-merriweather text-lg text-gray'>Let's get started by creating an account.</p>
						{error != '' && <p className='text-sm text-red-400 font-bold'>Error: {error}</p>}
					</div>
					<div className='flex flex-col gap-6 w-full'>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm'>Name</p>
							<Input placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} />
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm'>Email</p>
							<Input placeholder='Enter your email address' value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm'>Password</p>
							<Input placeholder='Enter your password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-sm'>Confirm Password</p>
							<Input
								placeholder='Confirm your password'
								type='password'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</div>
					<div className='flex flex-col items-center justify-center gap-4 w-full'>
						<button
							className='w-full bg-primary py-3 px-16 rounded-xl text-white font-bold shadow-[2px_4px_6px_0px_rgba(0,0,0,0.25)] hover:bg-[#8CB4FF]'
							onClick={signupHandler}
						>
							Sign up
						</button>
						<p className='text-gray font-merriweather text-sm'>
							Already have an account?{' '}
							<Link href='/login' className='underline text-pink hover:text-pinkhover'>
								Log in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Signup;
