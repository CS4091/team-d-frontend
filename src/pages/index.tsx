import Link from 'next/link';

const Home = () => {
	return (
		<>
			<video autoPlay loop muted playsInline className='fixed top-0 left-0 w-full h-full object-cover z-[-1]'>
				<source src='/videos/plane2.mp4' type='video/mp4' />
				Your browser does not support the video tag.
			</video>
			<div className='fixed top-0 left-0 w-full h-full bg-black/65 z-[-1]' />

			<div className='flex px-24 h-full justify-center items-center flex-col gap-4'>
				<p className='text-7xl font-extrabold text-white text-center'>
					Optimize Your Routes
					<br />
					<span className='text-primary'>Maximize</span> Savings
				</p>
				<p className='text-xl font-merriweather text-neutral-300 py-4'>
					Smarter flight planning made <span className='text-pink'>simple</span>--reduce costs and maximize efficiency effortlessly.
				</p>
				<Link
					className='w-fit bg-pink py-3 px-12 rounded-xl text-white font-bold shadow-[0px_0px_28px_3px_rgba(255,255,255,0.2)] hover:bg-pinkhover'
					href='/dashboard'
				>
					Start planning
				</Link>
				<p className='font-merriweather text-neutral-300'>🚀 No account required—get started for free!</p>
			</div>
		</>
	);
};

export default Home;
