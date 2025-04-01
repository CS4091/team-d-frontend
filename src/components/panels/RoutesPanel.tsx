import { Airport } from '@/interfaces/Airport';
import { useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import Panel from '../Panel';
import { Button } from '../ui/button';

interface Props {
	selectedAirportList: Airport[][];
	setSelectedAirportList: React.Dispatch<React.SetStateAction<Airport[][]>>;
	polylines: google.maps.Polyline[];
	setPolylines: React.Dispatch<React.SetStateAction<google.maps.Polyline[]>>;
	createNewPair: boolean;
	setCreateNewPair: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoutesPanel = ({ selectedAirportList, setSelectedAirportList, polylines, setPolylines, createNewPair, setCreateNewPair }: Props) => {
	const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

	const removeRoute = (index: number) => {
		setSelectedAirportList((prevList) => prevList.filter((_, i) => i !== index));

		polylines[index].setMap(null);
		setPolylines((prevList) => prevList.filter((_, i) => i !== index));
	};

	return (
		<Panel name='Routes' startingPosition={{ x: 50, y: 100 }}>
			<div className='overflow-y-scroll bg-gray-100 w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
				{!createNewPair && (
                    <Button className='w-full font-bold' onClick={() => setCreateNewPair(true)}>Create Route</Button>
				)}
				{createNewPair && (
                    <Button className='w-full font-bold' variant='destructive' onClick={() => setCreateNewPair(false)}>Cancel New Route</Button>
				)}
				{selectedAirportList.map((airport, i) => (
					<div
						key={`${airport[0].name}-${airport[1].name}`}
						onMouseEnter={() => setHoveredRoute(i)}
						onMouseLeave={() => setHoveredRoute(null)}
						onClick={() => removeRoute(i)}
					>
						<div
							className={`flex bg-gray-200 px-4 py-2 rounded-xl gap-5 items-center relative cursor-pointer transition-all duration-200 ${
								hoveredRoute === i ? 'bg-red-500 opacity-60' : ''
							}`}
						>
							<p className='text-lg py-2 font-bold'>{i + 1}</p>
							<div className='flex flex-col'>
								<p className='text-sm'>{airport[0].name}</p>
								<p className='text-sm'>{airport[1].name}</p>
							</div>
						</div>
						{hoveredRoute === i && (
							<div
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									transform: 'translateY(-50%) translateX(-50%)',
									cursor: 'pointer'
								}}
							>
								<FaTrashCan color='white' size={24} className='shadow-2xl' />
							</div>
						)}
					</div>
				))}
			</div>
		</Panel>
	);
};

export default RoutesPanel;
