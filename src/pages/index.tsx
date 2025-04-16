import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Home = () => {
	const [videoLoaded, setVideoLoaded] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

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
				className='fixed top-0 left-0 w-full h-full object-cover z-[0]'
			>
				<source src='/videos/plane2.mp4' type='video/mp4' />
				Your browser does not support the video tag.
			</motion.video>

			<motion.div
				initial={{ opacity: 1 }}
				animate={{ opacity: videoLoaded ? 0.75 : 1 }}
				transition={{ duration: 1 }}
				className='fixed top-0 left-0 w-full h-full bg-black z-[0]'
			/>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className='flex px-24 h-full justify-center items-center flex-col gap-4'
			>
				<p className='text-7xl font-extrabold text-white text-center'>
					Optimize Your Routes
					<br />
					<span className='text-primary'>Maximize</span> Savings
				</p>
				<p className='text-xl font-merriweather text-neutral-300 py-4'>
					Smarter flight planning made <span className='text-pink'>simple</span>—reduce costs and maximize efficiency effortlessly.
				</p>
				<Link
					className='w-fit bg-pink py-3 px-12 rounded-xl text-white font-bold shadow-[0px_0px_28px_3px_rgba(255,255,255,0.2)] hover:bg-pinkhover'
					href='/dashboard'
				>
					Start planning
				</Link>
				<p className='font-merriweather text-neutral-300'>🚀 No account required—get started for free!</p>
			</motion.div>
		</>
	);
};

export default Home;
