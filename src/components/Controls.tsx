import { Airport } from '@/interfaces/Airport';
import GenerateRouteButton from './GenerateRouteButton';
import { Route } from '@/interfaces/Route';
import { Asset } from '@/interfaces/Asset';

interface Props {
	selectedOrganization: string;
	routeList: Route[];
    inventory: Asset[];
}

const Controls = ({ selectedOrganization, routeList, inventory }: Props) => {
	
	return (
		<div className='fixed bottom-4 right-4 border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:rounded-2xl z-[48] p-6 flex flex-col gap-4'>
			{/* <button
				className='bg-pink py-3 px-12 rounded-xl text-white font-bold hover:bg-pinkhover'
			
			>
				View Past Routes
			</button> */}
			<GenerateRouteButton selectedOrganization={selectedOrganization} routeList={routeList} inventory={inventory} />
		</div>
	);
};

export default Controls;
