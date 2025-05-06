import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Asset } from '@/interfaces/Asset';
import { GeneratedRoute } from '@/interfaces/GeneratedRoute';
import { Route } from '@/interfaces/Route';
import api from '@/lib/axiosConfig';
import { RouteHistory } from '@/pages/dashboard';
import { WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { MdArrowRightAlt } from 'react-icons/md';
import { RxTriangleDown } from 'react-icons/rx';
import { Oval } from 'react-loader-spinner';
import { toast } from 'react-toastify';

interface Props {
	selectedOrganization: string;
	routeList: Route[];
	inventory: Asset[];
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setHasRoute: React.Dispatch<React.SetStateAction<boolean>>;
	addPolylines: (flights: string[][]) => void;
	setRouteHistory: React.Dispatch<React.SetStateAction<RouteHistory[]>>;
}

const GenerateRouteButton = ({ setHasRoute, open, setOpen, selectedOrganization, routeList, inventory, addPolylines, setRouteHistory }: Props) => {
	const [loading, setLoading] = useState(false);
	const [routeData, setRouteData] = useState<GeneratedRoute | null>(null);

	const calculateRoute = () => {
		setLoading(true);
		const transformedArray = routeList.map((item) => ({
			from: item.from.id,
			to: item.to.id,
			passengers: item.passengers
		}));
		api.post<GeneratedRoute>('/aviation/route', {
			organizationId: selectedOrganization,
			demand: transformedArray
		})
			.then((resp) => {
				setHasRoute(true);
				const data = resp.data;

				// Calculate total time for baseline and optimized routes
				const calculateTotalTime = (times: { [key: string]: number }) => {
					return Object.values(times).reduce((total, time) => total + time, 0);
				};

				// Pass the `times` object to calculateTotalTime
				const baselineTotalTime = calculateTotalTime(data.baseline.stats.times);
				const optimizedTotalTime = calculateTotalTime(data.optimized.stats.times);

				// Update routeData with the calculated total times
				setRouteData({
					...data,
					baseline: {
						...data.baseline,
						stats: {
							...data.baseline.stats,
							time: baselineTotalTime
						}
					},
					optimized: {
						...data.optimized,
						stats: {
							...data.optimized.stats,
							time: optimizedTotalTime
						}
					}
				});

				setLoading(false);
				setOpen(true);

				addPolylines(Object.values(resp.data.optimized.routing));
				api.get(`/organizations/${selectedOrganization}`)
					.then((resp) => {
						const calculateTotalTime = (times: { [key: string]: number }) => {
							return Object.values(times).reduce((total, time) => total + time, 0);
						};

						const enrichedRoutings = resp.data.routings.map((routing: any) => {
							const baselineTotalTime = calculateTotalTime(routing.data.baseline.stats.times);
							const optimizedTotalTime = calculateTotalTime(routing.data.optimized.stats.times);

							return {
								...routing,
								data: {
									...routing.data,
									baseline: {
										...routing.data.baseline,
										stats: {
											...routing.data.baseline.stats,
											time: baselineTotalTime
										}
									},
									optimized: {
										...routing.data.optimized,
										stats: {
											...routing.data.optimized.stats,
											time: optimizedTotalTime
										}
									}
								}
							};
						});
						setRouteHistory(enrichedRoutings);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);

				toast('No planes can finish the route', { type: 'error' });

				setLoading(false);
			});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
			}}
		>
			<button
				onClick={calculateRoute}
				disabled={routeList.length === 0 || loading}
				className='relative bg-gradient-to-r from-pink to-purple-400 bg-[length:200%_200%] bg-[position:0%_50%] py-3 px-12 rounded-xl text-white font-bold transition-all duration-500 ease-in-out enabled:hover:bg-[position:100%_50%] enabled:hover:shadow-xl disabled:opacity-50'
			>
				{!loading && (
					<>
						<WandSparkles className='inline mr-2 relative z-10' size={20} />
						<span className='relative z-10'>Generate Route</span>
					</>
				)}
				{loading && (
					<div className='flex items-center justify-center gap-2'>
						<Oval visible={true} height='16' width='16' wrapperStyle={{}} wrapperClass='' strokeWidth={6} color={'white'} />
						<p>Generating</p>
					</div>
				)}
			</button>

			<DialogContent className='bg-[#ffffff] max-w-3xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold'>Route Comparison Chart</DialogTitle>
				</DialogHeader>

				<div className='flex flex-col gap-2 p-4'>
					<div className='grid grid-cols-2 gap-x-8'>
						<div className='flex flex-col'>
							<p className='font-bold text-xl mb-1'>Baseline Route</p>
							<div className='flex items-center mb-2 mt-1 flex-wrap gap-2'>
								<p className='mb-2 mt-1 font-semibold text-sm font-merriweather bg-gray-500 px-4 py-1 w-fit rounded-full text-white'>
									{routeData?.baseline.stats.time.toFixed(2)} hrs
								</p>
								<p className='mb-2 mt-1 font-semibold text-sm font-merriweather bg-gray-700 px-4 py-1 w-fit rounded-full text-white'>
									${routeData?.baseline.stats.fuel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								</p>
							</div>
						</div>
						<div className='flex flex-col'>
							<p className='font-bold text-xl mb-1'>Optimized Route</p>
							<div className='flex items-center mb-2 mt-1 flex-wrap gap-2'>
								<p className='font-semibold text-sm font-merriweather bg-primary px-4 py-1 w-fit rounded-full text-white'>
									{routeData?.optimized.stats.time.toFixed(2)} hrs
								</p>
								<div className='flex items-center gap-2'>
									<p className='font-semibold text-sm font-merriweather bg-pink px-4 py-1 w-fit rounded-full text-white'>
										${routeData?.optimized.stats.fuel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									</p>
									<div className='flex items-center'>
										<RxTriangleDown
											fontSize={24}
											color={routeData?.baseline.stats.fuel! - routeData?.optimized.stats.fuel! > 0 ? '#3BC183' : '#757575'}
										/>
										<p
											className='text-[#3BC183] font-semibold text-sm font-merriweather -ml-1'
											style={{ color: routeData?.baseline.stats.fuel! - routeData?.optimized.stats.fuel! > 0 ? '#3BC183' : '#757575' }}
										>
											$
											{(routeData?.baseline.stats.fuel! - routeData?.optimized.stats.fuel!)
												.toFixed(2)
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-x-8 gap-y-3'>
						{inventory.map((inv) => (
							<>
								{routeData?.baseline.routing[inv.id] && routeData?.baseline.routing[inv.id].length > 1 && (
									<div className='flex flex-col' key={inv.id}>
										<div className='flex gap-1 whitespace-nowrap'>
											<p className='font-bold'>{inv.manufacturer} -</p>
											<p className='font-bold font-merriweather'>{inv.model}</p>
										</div>
										<div className='flex flex-wrap items-center max-w-full overflow-y-auto overflow-x-hidden break-words'>
											{(routeData?.baseline.routing[inv.id] || []).map((port, i, arr) => (
												<span key={i} className='flex items-center'>
													<p className='break-words whitespace-normal'>{port}</p>
													{i < arr.length - 1 && <MdArrowRightAlt size={20} />}
												</span>
											))}
										</div>
									</div>
								)}
								{routeData?.optimized.routing[inv.id] && routeData?.optimized.routing[inv.id].length > 1 && (
									<div className='flex flex-col'>
										<div className='flex gap-1 whitespace-nowrap'>
											<p className='font-bold'>{inv.manufacturer} -</p>
											<p className='font-bold font-merriweather'>{inv.model}</p>
										</div>
										<div className='flex flex-wrap items-center max-w-full overflow-auto'>
											{routeData?.optimized.routing[inv.id] &&
												routeData?.optimized.routing[inv.id].length > 1 &&
												(routeData?.optimized.routing[inv.id] || []).map((port, i, arr) => (
													<span key={i} className='flex items-center'>
														<p className='whitespace-nowrap'>{port}</p>
														{i < arr.length - 1 && <MdArrowRightAlt size={20} />}
													</span>
												))}
										</div>
									</div>
								)}
							</>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default GenerateRouteButton;
