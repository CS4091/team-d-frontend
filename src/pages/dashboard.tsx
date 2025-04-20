import Controls from '@/components/Controls';
import InventoryPanel from '@/components/panels/InventoryPanel';
import OrganizationPanel from '@/components/panels/OrganizationPanel';
import RoutesPanel from '@/components/panels/RoutesPanel';
import { Airport } from '@/interfaces/Airport';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { darkMapStyle } from '@/lib/mapStyle';
import { Cluster, MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMap, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';

const center = { lat: 39.8283, lng: -98.5795 };

const libraries: any[] = ['places'];

function Dashboard() {
	const [airports, setAirports] = useState<Airport[]>([]);
	const [selectedAirport, setSelectedAirport] = useState<Airport>({ lat: 0, lng: 0, name: 'None', id: '' });
	const [currentPair, setCurrentPair] = useState<Airport[]>([]);
	const [selectedAirportList, setSelectedAirportList] = useState<Airport[][]>([]);
	const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
	const [createNewPair, setCreateNewPair] = useState(false);
	const clustererRef = useRef<MarkerClusterer | null>(null);
	const clusteredMarkersRef = useRef<google.maps.Marker[]>([]);
	const routeMarkersRef = useRef<google.maps.Marker[]>([]);

	const [selectingHomebase, setSelectingHomebase] = useState(false);
	const [openInventory, setOpenInventory] = useState(false);
	const [homebase, setHomebase] = useState<{ name: string; id: string }>({ name: '', id: '' });

	const mapRef = useRef<google.maps.Map | null>(null);
	const router = useRouter();

	const { user, selectedOrganization } = useContext(UserContext);

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
		libraries: libraries
	});

	const handleMapLoad = (map: google.maps.Map) => {
		mapRef.current = map;
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/login');
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
				},
				zIndex: 99
			});

			marker.addListener('click', () => {
				if (selectingHomebase) {
					setHomebase({ id: airport.id, name: airport.name });
					setOpenInventory(true);
					setSelectingHomebase(false);
					return;
				}

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
	}, [airports, selectedAirportList, createNewPair, currentPair, selectingHomebase]);

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
			{selectedOrganization != '' && (
				<>
					<RoutesPanel
						selectedAirportList={selectedAirportList}
						setSelectedAirportList={setSelectedAirportList}
						polylines={polylines}
						setPolylines={setPolylines}
						setCreateNewPair={setCreateNewPair}
						startingPosition={{ x: 50, y: 400 }}
					/>
					<InventoryPanel
						startingPosition={{ x: 50, y: 600 }}
						setSelectingHomebase={setSelectingHomebase}
						openInventory={openInventory}
						setOpenInventory={setOpenInventory}
						homebase={homebase}
						setHomebase={setHomebase}
					/>
				</>
			)}
			<OrganizationPanel startingPosition={{ x: 50, y: 150 }} />
			<Controls selectedOrganization={selectedOrganization} routeList={selectedAirportList} />
			{createNewPair && (
                <div className='absolute top-6 left-1/2 transform -translate-x-1/2 bg-white z-10 rounded-xl px-8 text-lg py-3 font-medium shadow-[0px_0px_15px_2px_rgba(255,255,255,0.2)] flex gap-6 items-center justify-center z-[51]'>
                    <div className='flex flex-col'>

					<p className='font-semibold'>Select markers to create route</p>
                    <p className='text-sm text-neutral-400'>Tap selected marker to unselect</p>
                    </div>
					<button
						className='bg-red-300 px-5 py-1 rounded-lg text-red-600 hover:bg-red-200 font-medium'
						onClick={() => {
							setCreateNewPair(false);
							setCurrentPair([]);
						}}
					>
						Cancel
					</button>
				</div>
			)}
			{selectingHomebase && (
				<div className='absolute top-6 left-1/2 transform -translate-x-1/2 bg-white z-10 rounded-xl px-8 text-lg py-3 font-medium shadow-[0px_0px_15px_2px_rgba(255,255,255,0.2)] flex gap-6 items-center justify-center z-[51]'>
					<p className='font-semibold'>Select a marker to set the homebase</p>
					<button
						className='bg-red-300 px-5 py-1 rounded-lg text-red-600 hover:bg-red-200 font-medium'
						onClick={() => {
							setSelectingHomebase(false);
							setOpenInventory(true);
						}}
					>
						Cancel
					</button>
				</div>
			)}

			<GoogleMap
				onLoad={handleMapLoad}
				mapContainerStyle={{
					width: '100%',
					height: '100%',
					backgroundColor: '#000000',
					zIndex: (selectingHomebase || createNewPair) ? 50 : 1
				}}
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
					fullscreenControl: false,
					fullscreenControlOptions: {
						position: google.maps.ControlPosition.RIGHT_CENTER
					},
					mapTypeControl: false,
					styles: darkMapStyle,
					disableDefaultUI: true
				}}
			>
				{selectedAirport && selectedAirport.name != 'None' && (
					<InfoWindow
						position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }}
						onCloseClick={() => setSelectedAirport({ lat: 0, lng: 0, name: 'None', id: '' })}
					>
						<div className='flex flex-col items-start gap-2 max-w-64'>
							<p className='text-[16px] font-bold'>{selectedAirport.name}</p>
							<p className='text-[15px] font-medium text-neutral-500'>Airport ID - {selectedAirport.id}</p>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</div>
	);
}

export default Dashboard;
