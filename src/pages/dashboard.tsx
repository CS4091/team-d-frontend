import Controls from '@/components/Controls';
import InventoryPanel from '@/components/panels/InventoryPanel';
import OrganizationPanel from '@/components/panels/OrganizationPanel';
import RoutesPanel from '@/components/panels/RoutesPanel';
import SearchPanel from '@/components/panels/SearchPanel';
import Taskbar from '@/components/Taskbar';
import { Airplane } from '@/interfaces/Airplane';
import { Airport } from '@/interfaces/Airport';
import { Asset } from '@/interfaces/Asset';
import { GeneratedRoute } from '@/interfaces/GeneratedRoute';
import { Route } from '@/interfaces/Route';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { darkMapStyle } from '@/lib/mapStyle';
import { Cluster, MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMap, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';

const center = { lat: 39.8283, lng: -98.5795 };

const libraries: any[] = ['places'];

export interface RouteHistory {
	id: string;
	orgId: string;
	data: GeneratedRoute;
}

function Dashboard() {
	const [airports, setAirports] = useState<Airport[]>([]);
	const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
	const [currentPair, setCurrentPair] = useState<Airport[]>([]);
	const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
	const [createNewPair, setCreateNewPair] = useState(false);
	const [passengers, setPassengers] = useState(1);

	const clustererRef = useRef<MarkerClusterer | null>(null);
	const clusteredMarkersRef = useRef<google.maps.Marker[]>([]);
	const routeMarkersRef = useRef<google.maps.Marker[]>([]);

	const [routeList, setRouteList] = useState<Route[]>([]);
	const [inventory, setInventory] = useState<Asset[]>([]);

	const [selectingHomebase, setSelectingHomebase] = useState(false);
	const [openInventory, setOpenInventory] = useState(false);
	const [openRoutes, setOpenRoutes] = useState(false);
	const [homebase, setHomebase] = useState<{ name: string; id: string }>({ name: '', id: '' });

	const [model, setModel] = useState<Airplane | null>(null);

	const [openRoutesPanel, setOpenRoutesPanel] = useState(true);
	const [openInventoryPanel, setOpenInventoryPanel] = useState(true);
	const [openOrganizationPanel, setOpenOrganizationPanel] = useState(true);
	const [openSearchPanel, setOpenSearchPanel] = useState(true);

	const [routeHistory, setRouteHistory] = useState<RouteHistory[]>([]);

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
		if (selectedOrganization != '') {
			api.get(`/organizations/${selectedOrganization}/assets`)
				.then((resp) => {
					setInventory(resp.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [selectedOrganization]);

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
			if (model && airport.runways.some((runway) => runway.length < model.takeoffRunway)) {
				return;
			}

			const marker = new google.maps.Marker({
				position: { lat: airport.lat, lng: airport.lng },
				title: airport.name,
				icon: {
					url: `https://maps.google.com/mapfiles/ms/icons/${
						currentPair.length === 1 && currentPair.find((air) => air == airport) ? 'blue' : 'red'
					}-dot.png`,
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
			const isInRoute = routeList.some((pair) => pair.from.name === airport.name || pair.to.name === airport.name);

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
	}, [airports, routeList, createNewPair, currentPair, selectingHomebase]);

	const addAirport = (airport: Airport) => {
		if (!mapRef.current) return;
		if (currentPair.find((air) => air == airport)) {
			return;
		}
		if (currentPair.length == 1) {
			setCurrentPair([...currentPair, airport]);
			setCreateNewPair(false);
			setOpenRoutes(true);
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
					<div className={`${openRoutesPanel ? '' : 'hidden'}`}>
						<RoutesPanel
							routeList={routeList}
							setRouteList={setRouteList}
							polylines={polylines}
							setPolylines={setPolylines}
							setCreateNewPair={setCreateNewPair}
							startingPosition={{ x: 50, y: 400 }}
							passengers={passengers}
							setPassengers={setPassengers}
							currentPair={currentPair}
							setCurrentPair={setCurrentPair}
							openRoutes={openRoutes}
							setOpenRoutes={setOpenRoutes}
							mapRef={mapRef}
						/>
					</div>
					<div className={`${openInventoryPanel ? '' : 'hidden'}`}>
						<InventoryPanel
							startingPosition={{ x: 50, y: 600 }}
							setSelectingHomebase={setSelectingHomebase}
							openInventory={openInventory}
							setOpenInventory={setOpenInventory}
							homebase={homebase}
							setHomebase={setHomebase}
							model={model}
							setModel={setModel}
							inventory={inventory}
							setInventory={setInventory}
						/>
					</div>
				</>
			)}
			<div className={`${openOrganizationPanel ? '' : 'hidden'}`}>
				<OrganizationPanel startingPosition={{ x: 50, y: 150 }} setRouteHistory={setRouteHistory} />
			</div>
			<div className={`${openSearchPanel ? '' : 'hidden'}`}>
				<SearchPanel airports={airports} mapRef={mapRef} startingPosition={{ x: window.innerWidth - 350, y: 100 }} />
			</div>

			<Taskbar
				setOpenInventoryPanel={setOpenInventoryPanel}
				setOpenRoutesPanel={setOpenRoutesPanel}
				setOpenOrganizationPanel={setOpenOrganizationPanel}
				setOpenSearchPanel={setOpenSearchPanel}
				openSearchPanel={openSearchPanel}
				openInventoryPanel={openInventoryPanel}
				openRoutesPanel={openRoutesPanel}
				openOrganizationPanel={openOrganizationPanel}
			/>
			<Controls
				routeHistory={routeHistory}
				selectedOrganization={selectedOrganization}
				routeList={routeList}
				inventory={inventory}
				addPolylines={(flights) => {
					const newPolylines = flights.map((flight) => {
						const line = new google.maps.Polyline({
							path: flight.map((icao) => {
								const { lat, lng } = airports.find((airport) => airport.id === icao)!;
								return { lat, lng };
							}),
							strokeColor: '#FF61E2',
							strokeOpacity: 1.0,
							strokeWeight: 2
						});

						line.addListener('click', () => {
							const infoWindow = new google.maps.InfoWindow({
								content: `
					<div style="padding: 10px; font-size: 14px; color: #333; line-height: 1.5; width: 125px; height: 150px;">
						<p style="margin: 0; font-weight: bold; font-size: 16px;">Route Info:</p>
						<p style="margin: 5px 0;">From: <span style="color: #007BFF;">${flight[0]}</span></p>
						<p style="margin: 5px 0;">To: <span style="color: #007BFF;">${flight[flight.length - 1]}</span></p>
						<p style="margin: 5px 0;">Stops: <span style="color: #FF61E2;">${flight.length - 2}</span></p>
					</div>
				`
							});

							const midpoint = flight[Math.floor(flight.length / 2)];
							const { lat, lng } = airports.find((airport) => airport.id === midpoint)!;

							infoWindow.setPosition({ lat, lng });
							infoWindow.open(mapRef.current);
						});

						line.setMap(mapRef.current);
						return line;
					});

					setPolylines([...polylines, ...newPolylines]);
				}}
				polylines={polylines}
				setPolylines={setPolylines}
			/>
			{createNewPair && (
				<div className='absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-8 text-lg py-3 font-medium shadow-[0px_0px_15px_2px_rgba(255,255,255,0.2)] flex gap-6 items-center justify-center z-[51]'>
					<div className='flex flex-col'>
						<p className='font-semibold'>Select markers to create route</p>
						<p className='text-sm text-neutral-400'>Tap selected marker to unselect</p>
					</div>
					<button
						className='bg-red-200 px-5 py-1 rounded-lg text-red-600 hover:bg-red-300 font-medium'
						onClick={() => {
							setCreateNewPair(false);
							setCurrentPair([]);
							setOpenRoutes(true);
						}}
					>
						Cancel
					</button>
				</div>
			)}
			{selectingHomebase && (
				<div className='absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-8 text-lg py-3 font-medium shadow-[0px_0px_15px_2px_rgba(255,255,255,0.2)] flex gap-6 items-center justify-center z-[51]'>
					<p className='font-semibold'>Select a marker to set the homebase</p>
					<button
						className='bg-red-200 px-5 py-1 rounded-lg text-red-600 hover:bg-red-300 font-medium'
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
					zIndex: selectingHomebase || createNewPair ? 49 : 1
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
					<InfoWindow position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }} onCloseClick={() => setSelectedAirport(null)}>
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
