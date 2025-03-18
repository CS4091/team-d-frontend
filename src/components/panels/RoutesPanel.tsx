import Draggable from '@/components/Draggable';
import { Airport } from '@/interfaces/Airport';
import { useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTrashCan } from 'react-icons/fa6';

interface Props {
	selectedAirportList: Airport[][];
	setSelectedAirportList: React.Dispatch<React.SetStateAction<Airport[][]>>;
	polylines: google.maps.Polyline[];
	setPolylines: React.Dispatch<React.SetStateAction<google.maps.Polyline[]>>;
	createNewPair: boolean;
	setCreateNewPair: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoutesPanel = ({ selectedAirportList, setSelectedAirportList, polylines, setPolylines, createNewPair, setCreateNewPair }: Props) => {
	const [openRoutes, setOpenRoutes] = useState(true);
	const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

	const wasDragged = useRef(false);

	const handleMouseDown = () => {
		wasDragged.current = false;
	};

	const handleMouseMove = () => {
		wasDragged.current = true;
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (wasDragged.current) {
			e.stopPropagation();
			return;
		}
		setOpenRoutes(!openRoutes);
	};

	const removeRoute = (index: number) => {
		setSelectedAirportList((prevList) => prevList.filter((_, i) => i !== index));

		polylines[index].setMap(null);
		setPolylines((prevList) => prevList.filter((_, i) => i !== index));
	};

	return (
		<Draggable startingPosition={{ x: 50, y: 100 }}>
			<div className='absolute z-10 bg-white w-1/6 min-w-80 flex flex-col shadow rounded-xl'>
				<div
					className='cursor-pointer rounded-b-xl flex justify-between items-center px-4 py-4'
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onClick={handleClick}
				>
					<p className='font-medium'>Routes</p>
					{openRoutes && <FaChevronDown />}
					{!openRoutes && <FaChevronUp />}
				</div>
				{openRoutes && (
					<div className='overflow-y-scroll bg-gray-100 w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
						{!createNewPair && (
							<button
								className='bg-primary py-3 px-16 rounded-xl text-white font-bold hover:bg-[#8CB4FF]'
								onClick={() => setCreateNewPair(true)}
							>
								Create Route
							</button>
						)}
						{createNewPair && (
							<button
								className='bg-red-400 py-3 px-16 rounded-xl font-md hover:bg-red-300 text-white font-bold'
								onClick={() => setCreateNewPair(false)}
							>
								Cancel New Route
							</button>
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
				)}
			</div>
		</Draggable>
	);
};

export default RoutesPanel;
