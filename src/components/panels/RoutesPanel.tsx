import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Airport } from '@/interfaces/Airport';
import { Route } from '@/interfaces/Route';
import { Route as RouteIcon } from 'lucide-react';
import { RefObject, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import Panel from '../Panel';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
	routeList: Route[];
	setRouteList: React.Dispatch<React.SetStateAction<Route[]>>;
	polylines: google.maps.Polyline[];
	setPolylines: React.Dispatch<React.SetStateAction<google.maps.Polyline[]>>;
	currentPair: Airport[];
	setCurrentPair: React.Dispatch<React.SetStateAction<Airport[]>>;
	setCreateNewPair: React.Dispatch<React.SetStateAction<boolean>>;
	startingPosition: { x: number; y: number };
	passengers: number;
	setPassengers: React.Dispatch<React.SetStateAction<number>>;
	openRoutes: boolean;
	setOpenRoutes: React.Dispatch<React.SetStateAction<boolean>>;
	mapRef: RefObject<google.maps.Map | null>;
}

const RoutesPanel = ({
	routeList,
	setRouteList,
	polylines,
	setPolylines,
	currentPair,
	setCurrentPair,
	setCreateNewPair,
	startingPosition,
	passengers,
	setPassengers,
	openRoutes,
	setOpenRoutes,
	mapRef
}: Props) => {
	const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

	const removeRoute = (index: number) => {
		setRouteList((prevList) => prevList.filter((_, i) => i !== index));

		polylines[index].setMap(null);
		setPolylines((prevList) => prevList.filter((_, i) => i !== index));
	};

	const addRoute = () => {
		let polyline = new google.maps.Polyline({
			path: [
				{ lat: currentPair[0].lat, lng: currentPair[0].lng },
				{ lat: currentPair[1].lat, lng: currentPair[1].lng }
			],
			strokeColor: '#0000FF',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		polylines.filter((line) => line.get('strokeColor') !== '#0000FF').forEach((line) => line.setMap(null));

		setPolylines([...polylines.filter((line) => line.get('strokeColor') === '#0000FF'), polyline]);
		polyline.setMap(mapRef?.current);

		setRouteList([...routeList, { from: currentPair[0], to: currentPair[1], passengers: passengers }]);

		setCurrentPair([]);
		setPassengers(1);
		setOpenRoutes(false);
	};

	return (
		<Dialog
			open={openRoutes}
			onOpenChange={(isOpen) => {
				setOpenRoutes(isOpen);
				if (!isOpen) {
					setPassengers(1);
				}
			}}>
			<Panel name="Routes" startingPosition={startingPosition} icon={<RouteIcon strokeWidth={1.5} />}>
				<div className="overflow-y-scroll w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl">
					<DialogTrigger asChild>
						<Button className="w-full font-bold" onClick={() => setOpenRoutes(true)}>
							Create Route
						</Button>
					</DialogTrigger>
					{routeList.map((route, i) => (
						<div
							key={`${route.from.name}-${route.to.name}`}
							onMouseEnter={() => setHoveredRoute(i)}
							onMouseLeave={() => setHoveredRoute(null)}
							onClick={() => removeRoute(i)}>
							<div
								className={`flex flex-col bg-gray-200 px-4 py-2 rounded-xl gap-5 relative cursor-pointer h-full transition-all duration-200 ${
									hoveredRoute === i ? 'bg-red-500 opacity-60' : ''
								}`}>
								{/* <p className='text-lg py-2 font-bold'>{i + 1}</p> */}
								<div className="grid grid-cols-[4rem_auto] w-full gap-y-1">
									<p className="text-sm font-bold">FROM</p>
									<p className="text-sm">{route.from.name}</p>

									<p className="text-sm font-bold">TO</p>
									<p className="text-sm">{route.to.name}</p>
									<p className="text-sm font-bold">WITH</p>
									<p className="text-sm">{route.passengers} passenger(s)</p>
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
									}}>
									<FaTrashCan color="white" size={24} className="shadow-2xl" />
								</div>
							)}
						</div>
					))}
				</div>
			</Panel>

			<DialogContent className="sm:max-w-md bg-[#ffffff]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Create Route</DialogTitle>
				</DialogHeader>

				<div className="mt-2">
					<div className="flex flex-col w-full items-center gap-4">
						<div className="flex flex-col gap-2 w-full">
							<Label>Passengers</Label>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									placeholder="Enter number of passengers"
									value={passengers}
									onChange={(e) => setPassengers(parseInt(e.target.value))}
								/>
								<Button
									variant={'secondary'}
									onClick={() => {
										setOpenRoutes(false);
										setCreateNewPair(true);
									}}>
									Select Path
								</Button>
							</div>
						</div>
						<div className="flex items-center gap-2 w-full">
							<div className="flex flex-col gap-2 w-full">
								<Label>From</Label>

								<Input
									value={currentPair.length === 0 ? '' : currentPair[0].name}
									readOnly={true}
									disabled={currentPair.length === 0}
									placeholder="No path selected"
									className="w-full"
								/>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<Label>To</Label>

								<Input
									value={currentPair.length < 2 ? '' : currentPair[1].name}
									readOnly={true}
									disabled={currentPair.length < 2}
									placeholder="No path selected"
									className="w-full"
								/>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button className="w-full font-bold" onClick={addRoute} disabled={passengers === 0 || currentPair.length < 2}>
						Add Route
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RoutesPanel;

