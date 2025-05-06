import Panel from '@/components/Panel';
import { Input } from '@/components/ui/input';
import { Airport } from '@/interfaces/Airport';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
	airports: Airport[];
	mapRef: React.MutableRefObject<google.maps.Map | null>;
	startingPosition: { x: number; y: number };
}

const SearchPanel = ({ airports, mapRef, startingPosition }: Props) => {
	const [searchValue, setSearchValue] = useState('');

	const handleAirportClick = (airport: Airport) => {
        setSearchValue('');
		if (mapRef.current) {
			mapRef.current.panTo({ lat: airport.lat, lng: airport.lng });
			mapRef.current.setZoom(10);
		}
	};

	const filteredAirports = airports.filter((airport) => airport.name.toLowerCase().startsWith(searchValue.toLowerCase()));

	return (
		<Panel name='Search' startingPosition={startingPosition} icon={<Search strokeWidth={1.5} />}  overlap={true}>
			<div className='overflow-y-scroll px-4 py-4 flex flex-col gap-3 rounded-b-xl'>
				<div className='relative'>
					<Search className='absolute left-3 top-2.5 h-5 w-5 text-neutral-500 z-20' />
					<Input
						type='text'
						placeholder='Enter the airport name'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className='pl-10'
					/>
				</div>
				{searchValue != '' &&
					filteredAirports.length > 0 &&
					filteredAirports.map((airport) => (
						<div
							key={airport.id}
							className='text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-2 rounded-md'
							onClick={() => handleAirportClick(airport)}
						>
							{airport.name}
						</div>
					))}
			</div>
		</Panel>
	);
};

export default SearchPanel;
