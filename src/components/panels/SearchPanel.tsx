import { Input } from '@/components/ui/input';
import Panel from '@/components/Panel';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Airport } from '@/interfaces/Airport';

interface Props {
    airports: Airport[];
    mapRef: React.MutableRefObject<google.maps.Map | null>;
    startingPosition: { x: number; y: number };
}

const SearchPanel = ({ airports, mapRef, startingPosition }: Props) => {
    const [searchValue, setSearchValue] = useState('');

    const handleAirportClick = (airport: Airport) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat: airport.lat, lng: airport.lng });
            mapRef.current.setZoom(10);
        }
    };

    const filteredAirports = airports.filter((airport) =>
        airport.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <Panel name="Search Airports" startingPosition={startingPosition} icon={<Search strokeWidth={1.5} />}>
            <div className="overflow-y-auto px-4 py-4 flex flex-col gap-3 rounded-b-xl max-h-[35vh]">
                <Input
                    type="text"
                    placeholder="Search airports..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10"
                />
                {filteredAirports.length > 0 ? (
                    filteredAirports.map((airport) => (
                        <div
                            key={airport.id}
                            className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-2 rounded-md"
                            onClick={() => handleAirportClick(airport)}
                        >
                            {airport.name}
                        </div>
                    ))
                ) : (
                    <p className="text-neutral-500 text-sm mt-2">No airports found.</p>
                )}
            </div>
        </Panel>
    );
};

export default SearchPanel;
