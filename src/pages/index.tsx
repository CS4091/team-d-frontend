import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
	width: '100%',
	height: '100%'
};

const center = { lat: 39.8283, lng: -98.5795 };

interface Airport {
	lat: number;
	lng: number;
	name: string;
}

function MapComponent() {
	const [airports, setAirports] = useState<{ name: string; lat: number; lng: number }[]>([]);
	const [selectedAirport, setSelectedAirport] = useState<Airport>({ lat: 0, lng: 0, name: 'None' });
	const [selectedAirportList, setSelectedAirportList] = useState<Airport[]>([]);

	useEffect(() => {
		async function fetchAirports() {
			const response = await fetch('/data/airports.csv');
			const text = await response.text();
			const rows = text.split('\n').slice(1);
			const parsedAirports = rows
				.map((row) => {
					const cols = row.split(',');
					return { name: cols[3], lat: parseFloat(cols[4]), lng: parseFloat(cols[5]) };
				})
				.filter((airport) => !isNaN(airport.lat) && !isNaN(airport.lng));

			setAirports(parsedAirports);
			console.log(parsedAirports);
		}
		fetchAirports();
	}, []);

	const addAirport = (airport: Airport) => {
		if (selectedAirportList.find((air) => air == airport)) {
			return;
		}
		setSelectedAirportList([...selectedAirportList, airport]);
	};

	const removeAirport = (airport: Airport) => {
		if (!selectedAirportList.find((air) => air == airport)) {
			return;
		}
        
		setSelectedAirportList(selectedAirportList.filter((air) => air != airport));
	};

	return (
		<div className='h-screen'>
			<div className='absolute z-10 bg-white h-full w-1/4 py-4 px-4 gap-4 flex flex-col items-center shadow'>
				<p className='text-xl text-center font-bold'>Current Route</p>
				{selectedAirportList.map((airport) => (
					<p className='text-lg text-center bg-gray-200 px-6 py-2 rounded-xl' key={airport.name}>
						{airport.name}
					</p>
				))}
				<button className='bg-blue-300 py-2 px-16 rounded-xl font-md hover:bg-blue-400'>Send</button>
			</div>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				zoom={4}
				options={{
					minZoom: 3,
					maxZoom: 50,
					restriction: {
						latLngBounds: {
							north: 85,
							south: -85,
							west: -180,
							east: 180
						},
						strictBounds: false
					}
				}}
			>
				{airports.map((airport, index) => (
					<Marker
						key={index}
						position={{ lat: airport.lat, lng: airport.lng }}
						title={airport.name}
						onClick={() => {
							setSelectedAirport(airport);
						}}
					/>
				))}
				{selectedAirport && selectedAirport.name != 'None' && (
					<InfoWindow
						position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }}
						onCloseClick={() => setSelectedAirport({ lat: 0, lng: 0, name: 'None' })}
					>
						<div className='flex flex-col gap-6 max-w-64'>
							<p className='text-md font-bold text-center'>{selectedAirport.name}</p>
							<div className='flex flex-col gap-2'>
								{!selectedAirportList.find((air) => air == selectedAirport) && (
									<button className='bg-blue-300 py-2 px-6 rounded-xl font-md hover:bg-blue-400' onClick={() => addAirport(selectedAirport)}>Add to Route</button>
								)}
								{selectedAirportList.find((air) => air == selectedAirport) && (
									<button className='bg-red-300 py-2 px-6 rounded-xl font-md hover:bg-red-400' onClick={() => removeAirport(selectedAirport)}>Remove from Route</button>
								)}
							</div>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</div>
	);
}

const Home = () => {
	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
			<MapComponent />
		</LoadScript>
	);
};

export default Home;

