import InventoryPanel from '@/components/panels/InventoryPanel';
import OrganizationPanel from '@/components/panels/OrganizationPanel';
import RoutesPanel from '@/components/panels/RoutesPanel';
import { Airport } from '@/interfaces/Airport';
import api from '@/lib/axiosConfig';
import { darkMapStyle } from '@/lib/mapStyle';
import { Cluster, MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMap, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

const containerStyle = {
	width: '100%',
	height: '100%',
    backgroundColor: '#000000',
};

const center = { lat: 39.8283, lng: -98.5795 };

function Dashboard() {
	const [airports, setAirports] = useState<{ name: string; lat: number; lng: number }[]>([]);
	const [selectedAirport, setSelectedAirport] = useState<Airport>({ lat: 0, lng: 0, name: 'None' });
	const [currentPair, setCurrentPair] = useState<Airport[]>([]);
	const [selectedAirportList, setSelectedAirportList] = useState<Airport[][]>([]);
	const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
	const [createNewPair, setCreateNewPair] = useState(false);
	const clustererRef = useRef<MarkerClusterer | null>(null);
	const clusteredMarkersRef = useRef<google.maps.Marker[]>([]);
	const routeMarkersRef = useRef<google.maps.Marker[]>([]);
	const [loggedIn, setLoggedIn] = useState(false);

	const mapRef = useRef<google.maps.Map | null>(null);

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
		libraries: ['places']
	});

	const handleMapLoad = (map: google.maps.Map) => {
		mapRef.current = map;
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setLoggedIn(true);
		}
	}, []);

	useEffect(() => {
		api.get('/aviation/airports')
			.then((resp) => {
				setAirports(resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		if (!mapRef.current || airports.length === 0) return;

		// Clear existing markers
		clusteredMarkersRef.current.forEach((marker) => marker.setMap(null));
		routeMarkersRef.current.forEach((marker) => marker.setMap(null));
		clustererRef.current?.clearMarkers();

		const clusteredMarkers: google.maps.Marker[] = [];
		const routeMarkers: google.maps.Marker[] = [];

		airports.forEach((airport) => {
			const marker = new google.maps.Marker({
				position: { lat: airport.lat, lng: airport.lng },
				title: airport.name,
				icon: {
					url: `https://maps.google.com/mapfiles/ms/icons/${currentPair.find((air) => air == airport) ? 'blue' : 'red'}-dot.png`,
					scaledSize: new window.google.maps.Size(40, 40)
				}
			});

			marker.addListener('click', () => {
				if (!createNewPair) {
					setSelectedAirport(airport);
				} else {
					if (currentPair.find((air) => air.name === airport.name)) {
						removeAirport(airport);
					} else {
						addAirport(airport);
					}
				}
			});

			// Check if this marker is part of a selected route
			const isInRoute = selectedAirportList.some((pair) => pair.some((air) => air.name === airport.name));

			if (isInRoute) {
				marker.setMap(mapRef.current); // Always show route markers
				routeMarkers.push(marker);
			} else {
				clusteredMarkers.push(marker); // Let clusterer handle the rest
			}
		});

		// Store route markers
		routeMarkersRef.current = routeMarkers;

		// Create clusterer for non-route markers
		clustererRef.current = new MarkerClusterer({
			markers: clusteredMarkers,
			map: mapRef.current,
			renderer: {
				render: ({ count, position }: Cluster) => {
					return new google.maps.Marker({
						position,
						icon: {
							url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
							scaledSize: new google.maps.Size(40, 40),
							labelOrigin: new google.maps.Point(18.5, 12)
						},
						label: {
							text: String(count),
							color: 'white',
							fontWeight: 'bold',
							fontSize: '14px'
						}
					});
				}
			}
		});

		clusteredMarkersRef.current = clusteredMarkers;

		return () => {
			if (typeof google !== 'undefined' && mapRef.current) {
				clusteredMarkersRef.current.forEach((marker) => marker.setMap(null));
				routeMarkersRef.current.forEach((marker) => marker.setMap(null));
				clustererRef.current?.clearMarkers();
			}
		};
	}, [airports, selectedAirportList, createNewPair, currentPair]);

	const addAirport = (airport: Airport) => {
		if (!mapRef.current) return;
		if (currentPair.find((air) => air == airport)) {
			return;
		}
		if (currentPair.length == 1) {
			let polyline = new google.maps.Polyline({
				path: [
					{ lat: currentPair[0].lat, lng: currentPair[0].lng },
					{ lat: airport.lat, lng: airport.lng }
				],
				strokeColor: '#0000FF',
				strokeOpacity: 1.0,
				strokeWeight: 2
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

	if (loadError) return <div>Error loading maps</div>;
	if (!isLoaded) return <div className='text-center p-10'>Loading map...</div>;

	return (
		<div className='h-full overflow-hidden'>
			<RoutesPanel
				selectedAirportList={selectedAirportList}
				setSelectedAirportList={setSelectedAirportList}
				polylines={polylines}
				setPolylines={setPolylines}
				createNewPair={createNewPair}
				setCreateNewPair={setCreateNewPair}
			/>
			<InventoryPanel />
			{loggedIn && <OrganizationPanel />}
			{createNewPair && (
				<div className='absolute top-24 left-1/2 transform -translate-x-1/2 bg-white z-10 rounded-xl px-4 py-2 shadow'>
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
							east: 180
						},
						strictBounds: false
					},
					fullscreenControl: true,
					fullscreenControlOptions: {
						position: google.maps.ControlPosition.RIGHT_CENTER
					},
					mapTypeControl: false,
					styles: darkMapStyle,
					disableDefaultUI: true
				}}
			>
				{/* {airports.map((airport, index) => (
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
				*/}

				{selectedAirport && selectedAirport.name != 'None' && (
					<InfoWindow
						position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }}
						onCloseClick={() => setSelectedAirport({ lat: 0, lng: 0, name: 'None' })}
					>
						<div className='flex flex-col gap-6 max-w-64'>
							<p className='text-md font-bold text-center'>{selectedAirport.name}</p>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</div>
	);
}

export default Dashboard;
