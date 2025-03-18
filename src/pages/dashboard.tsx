import InventoryPanel from '@/components/panels/InventoryPanel';
import RoutesPanel from '@/components/panels/RoutesPanel';
import { Airport } from '@/interfaces/Airport';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/axiosConfig';

const containerStyle = {
	width: '100%',
	height: '100%',
};

const center = { lat: 39.8283, lng: -98.5795 };

function MapComponent() {
	const [airports, setAirports] = useState<{ name: string; lat: number; lng: number }[]>([]);
	const [selectedAirport, setSelectedAirport] = useState<Airport>({ lat: 0, lng: 0, name: 'None' });
	const [currentPair, setCurrentPair] = useState<Airport[]>([]);
	const [selectedAirportList, setSelectedAirportList] = useState<Airport[][]>([]);
	const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
	const [createNewPair, setCreateNewPair] = useState(false);

	const mapRef = useRef<google.maps.Map | null>(null);

	const handleMapLoad = (map: google.maps.Map) => {
		mapRef.current = map;
	};

	useEffect(() => {
		async function fetchAirports() {
			// const response = await fetch('/data/airports.csv');
			// const text = await response.text();
			// const rows = text.split('\n').slice(1);
			// const parsedAirports = rows
			// 	.map((row) => {
			// 		const cols = row.split(',');
			// 		return { name: cols[3], lat: parseFloat(cols[4]), lng: parseFloat(cols[5]) };
			// 	})
			// 	.filter((airport) => !isNaN(airport.lat) && !isNaN(airport.lng));
            // setAirports(parsedAirports)
		}
		// fetchAirports();
        api.get('/aviation/airports')
        .then((resp) => {
            setAirports(resp.data);
        })
        .catch((err) => {
            console.log(err);
        });
	}, []);

	const addAirport = (airport: Airport) => {
		if (!mapRef.current) return;
		if (currentPair.find((air) => air == airport)) {
			return;
		}
		if (currentPair.length == 1) {
			let polyline = new google.maps.Polyline({
				path: [
					{ lat: currentPair[0].lat, lng: currentPair[0].lng },
					{ lat: airport.lat, lng: airport.lng },
				],
				strokeColor: '#0000FF',
				strokeOpacity: 1.0,
				strokeWeight: 2,
			});

			setPolylines([...polylines, polyline]);
			polyline.setMap(mapRef.current);

			setSelectedAirportList([...selectedAirportList, [...currentPair, airport]]);
			setCurrentPair([]);

			setCreateNewPair(false);
		} else {
			setCurrentPair([airport]);
		}
	};

	const removeAirport = (airport: Airport) => {
		if (!currentPair.find((air) => air == airport)) {
			return;
		}

		setCurrentPair(currentPair.filter((air) => air != airport));
	};

	return (
		<div className="h-full overflow-hidden">
			<RoutesPanel
				selectedAirportList={selectedAirportList}
				setSelectedAirportList={setSelectedAirportList}
				polylines={polylines}
				setPolylines={setPolylines}
				createNewPair={createNewPair}
				setCreateNewPair={setCreateNewPair}
			/>
			<InventoryPanel />
			{createNewPair && (
				<div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white z-10 rounded-xl px-4 py-2 shadow">
					<p>Select 2 markers to create route</p>
				</div>
			)}

			<GoogleMap
				onLoad={handleMapLoad}
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
							east: 180,
						},
						strictBounds: false,
					},
					fullscreenControl: true,
					fullscreenControlOptions: {
						position: google.maps.ControlPosition.RIGHT_CENTER,
					},
					mapTypeControl: false,
				}}
			>
				{airports.map((airport, index) => (
					<Marker
						key={index}
						position={{ lat: airport.lat, lng: airport.lng }}
						title={airport.name}
						onClick={() => {
							if (!createNewPair) {
								setSelectedAirport(airport);
								return;
							}
							if (currentPair.find((air) => air == airport)) {
								removeAirport(airport);
							} else {
								addAirport(airport);
							}
						}}
						icon={{
							url: `https://maps.google.com/mapfiles/ms/icons/${currentPair.find((air) => air == airport) ? 'blue' : 'red'}-dot.png`,
							scaledSize: new window.google.maps.Size(40, 40),
						}}
					/>
				))}

				{selectedAirport && selectedAirport.name != 'None' && (
					<InfoWindow
						position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }}
						onCloseClick={() => setSelectedAirport({ lat: 0, lng: 0, name: 'None' })}
					>
						<div className="flex flex-col gap-6 max-w-64">
							<p className="text-md font-bold text-center">{selectedAirport.name}</p>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</div>
	);
}

const Dashboard = () => {
	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
			<MapComponent />
		</LoadScript>
	);
};

export default Dashboard;
