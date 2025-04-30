import { Asset } from '@/interfaces/Asset';
import { Route } from '@/interfaces/Route';
import GenerateRouteButton from './GenerateRouteButton';
import { useState } from 'react';
import { Eye } from 'lucide-react';

interface Props {
	selectedOrganization: string;
	routeList: Route[];
	inventory: Asset[];

	addPolylines: (flights: string[][]) => void;
}

const Controls = ({ selectedOrganization, routeList, inventory, addPolylines }: Props) => {
	const [open, setOpen] = useState(false);
	const [hasRoute, setHasRoute] = useState(false);

	return (
		<div className="fixed bottom-4 right-4 border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:rounded-2xl z-[48] p-6 flex flex-col gap-4">
			<button
				disabled={!hasRoute}
				onClick={() => setOpen(true)}
				className="relative bg-gradient-to-r from-primary to-indigo-300 bg-[length:200%_200%] bg-[position:0%_50%] py-3 px-12 rounded-xl text-white font-bold transition-all duration-500 ease-in-out enabled:hover:bg-[position:100%_50%] enabled:hover:shadow-xl disabled:opacity-50"
			>
				<Eye className="inline mr-2 relative z-10" size={20} />
				<span className="relative z-10">View Last Chart</span>
			</button>

			<GenerateRouteButton
				setHasRoute={setHasRoute}
				open={open}
				setOpen={setOpen}
				selectedOrganization={selectedOrganization}
				routeList={routeList}
				inventory={inventory}
				addPolylines={addPolylines}
			/>
		</div>
	);
};

export default Controls;
