import { Airport } from '@/interfaces/Airport';
import api from '@/lib/axiosConfig';
import { WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';

interface Props {
	selectedOrganization: string;
	routeList: Airport[][];
}

const Controls = ({ selectedOrganization, routeList }: Props) => {
	const [loading, setLoading] = useState(false);

	const calculateRoute = () => {
		setLoading(true);
		api.post('/aviation/route', {
			organizationId: selectedOrganization,
			demand: routeList.map((pair) => pair.map((airport) => airport.id))
		})
			.then((resp) => {
				console.log(resp.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
                setLoading(false);
			});
	};

	return (
		<div className='fixed bottom-4 right-4 border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:rounded-2xl z-[48] p-6 flex flex-col gap-4'>
			{/* <button
				className='bg-pink py-3 px-12 rounded-xl text-white font-bold hover:bg-pinkhover'
			
			>
				View Past Routes
			</button> */}
			<button
				onClick={calculateRoute}
				disabled={routeList.length === 0 || loading}
				className='relative bg-gradient-to-r from-pink to-primary bg-[length:200%_200%] bg-[position:0%_50%] py-3 px-12 rounded-xl text-white font-bold transition-all duration-500 ease-in-out enabled:hover:bg-[position:100%_50%] enabled:hover:shadow-xl disabled:opacity-50'
			>
				{!loading && (
					<>
						<WandSparkles className='inline mr-2 relative z-10' size={20} />
						<span className='relative z-10'>Generate Route</span>
					</>
				)}
				{loading && 
                <div className='flex items-center justify-center gap-2'>
                <Oval visible={true} height='16' width='16' wrapperStyle={{}} wrapperClass='' strokeWidth={6} color={'white'} />
                <p>Generating</p>
                </div>}
			</button>
		</div>
	);
};

export default Controls;
