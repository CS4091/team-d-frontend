import { Asset } from '@/interfaces/Asset';
import { Route } from '@/interfaces/Route';
import { RouteHistory } from '@/pages/dashboard';
import { Eraser } from 'lucide-react';
import { useState } from 'react';
import GenerateRouteButton from './GenerateRouteButton';
import HistoryButton from './HistoryButton';

interface Props {
	selectedOrganization: string;
	routeList: Route[];
	inventory: Asset[];
	addPolylines: (flights: string[][]) => void;
	polylines: google.maps.Polyline[];
	setPolylines: React.Dispatch<React.SetStateAction<google.maps.Polyline[]>>;
	routeHistory: RouteHistory[];
    setRouteHistory: React.Dispatch<React.SetStateAction<RouteHistory[]>>;
}

const Controls = ({ selectedOrganization, routeList, inventory, addPolylines, polylines, setPolylines, routeHistory, setRouteHistory }: Props) => {
	const [open, setOpen] = useState(false);
	const [hasRoute, setHasRoute] = useState(false);

	const clearPolylines = () => {
		polylines.filter((line) => line.get('strokeColor') !== '#0000FF').forEach((line) => line.setMap(null));
		setPolylines([...polylines.filter((line) => line.get('strokeColor') === '#0000FF')]);
		setHasRoute(false);
	};

	return (
		<div className='fixed bottom-4 right-4 border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:rounded-2xl z-[48] p-6 flex flex-col gap-4'>
			<button
				disabled={!hasRoute}
				onClick={() => clearPolylines()}
				className='relative bg-gradient-to-r from-red-400 to-orange-300 bg-[length:200%_200%] bg-[position:0%_50%] py-3 px-12 rounded-xl text-white font-bold transition-all duration-500 ease-in-out enabled:hover:bg-[position:100%_50%] enabled:hover:shadow-xl disabled:opacity-50 flex items-center justify-center'
			>
				<Eraser className='inline mr-2 relative z-10' size={20} />
				<span className='relative z-10'>Clear Last Route</span>
			</button>

			<HistoryButton
				setHasRoute={setHasRoute}
				selectedOrganization={selectedOrganization}
				routeList={routeList}
				inventory={inventory}
				addPolylines={addPolylines}
				routeHistory={routeHistory}
			/>

			<GenerateRouteButton
				setHasRoute={setHasRoute}
				open={open}
				setOpen={setOpen}
				selectedOrganization={selectedOrganization}
				routeList={routeList}
				inventory={inventory}
				addPolylines={addPolylines}
                setRouteHistory={setRouteHistory}
			/>
		</div>
	);
};

export default Controls;
