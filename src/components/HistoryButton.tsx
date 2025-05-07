import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Asset } from '@/interfaces/Asset';
import { GeneratedRoute } from '@/interfaces/GeneratedRoute';
import { Route } from '@/interfaces/Route';
import { RouteHistory } from '@/pages/dashboard';
import { History } from 'lucide-react';
import { useState } from 'react';
import { MdArrowRightAlt } from 'react-icons/md';
import { RxTriangleDown } from 'react-icons/rx';

interface Props {
	selectedOrganization: string;
	routeList: Route[];
	inventory: Asset[];

	setHasRoute: React.Dispatch<React.SetStateAction<boolean>>;
	addPolylines: (flights: string[][]) => void;
	routeHistory: RouteHistory[];
}

const HistoryButton = ({ setHasRoute, selectedOrganization, routeList, inventory, addPolylines, routeHistory }: Props) => {
	const [selected, setSelected] = useState<GeneratedRoute | null>(null);
	const [open, setOpen] = useState(false);

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (selected == null) {
					setOpen(isOpen);
				}
				setSelected(null);
			}}
		>
			<button
				onClick={() => setOpen(true)}
				className='relative bg-gradient-to-r from-primary to-indigo-300 bg-[length:200%_200%] bg-[position:0%_50%] py-3 px-12 rounded-xl text-white font-bold transition-all duration-500 ease-in-out enabled:hover:bg-[position:100%_50%] enabled:hover:shadow-xl disabled:opacity-50 flex items-center justify-center'
			>
				<History className='inline mr-2 relative z-10' size={20} />
				<span className='relative z-10'>Route History</span>
			</button>
			{selected == null && (
				<DialogContent className='bg-[#ffffff] max-w-3xl max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold'>Route History</DialogTitle>
					</DialogHeader>
					<div>
						{routeHistory?.map((route) => (
							<div className='py-2 px-4 rounded-md hover:bg-neutral-200 cursor-pointer' onClick={() => setSelected(route?.data)}>
								<div className='flex items-center mb-2 mt-1 flex-wrap gap-2'>
									<p className='mr-auto font-merriweather'>{new Date(route.createdAt).toLocaleString()}</p>
									<p className='font-semibold text-sm font-merriweather bg-primary px-4 py-1 w-[100px] text-center rounded-full text-white'>
										{route?.data?.optimized.stats.time.toFixed(2)} hrs
									</p>
									<div className='flex items-center gap-2'>
										<p className='font-semibold text-sm font-merriweather bg-pink px-4 py-1 w-[120px] text-center rounded-full text-white'>
											${route?.data?.optimized.stats.fuel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										</p>
										<div className='flex items-center w-[100px] justify-end'>
											<RxTriangleDown
												fontSize={24}
												color={route?.data?.baseline.stats.fuel! - route?.data?.optimized.stats.fuel! > 0 ? '#3BC183' : '#757575'}
											/>
											<p
												className='font-semibold text-sm font-merriweather -ml-1'
												style={{
													color: route?.data?.baseline.stats.fuel! - route?.data?.optimized.stats.fuel! > 0 ? '#3BC183' : '#757575'
												}}
											>
												$
												{(route?.data?.baseline.stats.fuel! - route?.data?.optimized.stats.fuel!)
													.toFixed(2)
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}

						{routeHistory?.length === 0 && (
							<div>
								<p>No history found</p>
							</div>
						)}
					</div>
				</DialogContent>
			)}

			{selected != null && (
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
										{selected?.baseline.stats.time.toFixed(2)} hrs
									</p>
									<p className='mb-2 mt-1 font-semibold text-sm font-merriweather bg-gray-700 px-4 py-1 w-fit rounded-full text-white'>
										${selected?.baseline.stats.fuel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									</p>
								</div>
							</div>
							<div className='flex flex-col'>
								<p className='font-bold text-xl mb-1'>Optimized Route</p>
								<div className='flex items-center mb-2 mt-1 flex-wrap gap-2'>
									<p className='font-semibold text-sm font-merriweather bg-primary px-4 py-1 w-fit rounded-full text-white'>
										{selected?.optimized.stats.time.toFixed(2)} hrs
									</p>
									<div className='flex items-center gap-2'>
										<p className='font-semibold text-sm font-merriweather bg-pink px-4 py-1 w-fit rounded-full text-white'>
											${selected?.optimized.stats.fuel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										</p>
										<div className='flex items-center'>
											<RxTriangleDown
												fontSize={24}
												color={selected?.baseline.stats.fuel! - selected?.optimized.stats.fuel! > 0 ? '#3BC183' : '#757575'}
											/>
											<p
												className='text-[#3BC183] font-semibold text-sm font-merriweather -ml-1'
												style={{
													color: selected?.baseline.stats.fuel! - selected?.optimized.stats.fuel! > 0 ? '#3BC183' : '#757575'
												}}
											>
												$
												{(selected?.baseline.stats.fuel! - selected?.optimized.stats.fuel!)
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
									{selected?.baseline.routing[inv.id] && selected?.baseline.routing[inv.id].length > 1 && (
										<div className='flex flex-col' key={inv.id}>
											<div className='flex gap-1 whitespace-nowrap'>
												<p className='font-bold'>{inv.manufacturer} -</p>
												<p className='font-bold font-merriweather'>{inv.model}</p>
											</div>
											<div className='flex flex-wrap items-center max-w-full overflow-y-auto overflow-x-hidden break-words'>
												{(selected?.baseline.routing[inv.id] || []).map((port, i, arr) => (
													<span key={i} className='flex items-center'>
														<p className='break-words whitespace-normal'>{port}</p>
														{i < arr.length - 1 && <MdArrowRightAlt size={20} />}
													</span>
												))}
											</div>
										</div>
									)}
									{selected?.optimized.routing[inv.id] && selected?.optimized.routing[inv.id].length > 1 && (
										<div className='flex flex-col'>
											<div className='flex gap-1 whitespace-nowrap'>
												<p className='font-bold'>{inv.manufacturer} -</p>
												<p className='font-bold font-merriweather'>{inv.model}</p>
											</div>
											<div className='flex flex-wrap items-center max-w-full overflow-auto'>
												{selected?.optimized.routing[inv.id] &&
													selected?.optimized.routing[inv.id].length > 1 &&
													(selected?.optimized.routing[inv.id] || []).map((port, i, arr) => (
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
			)}
		</Dialog>
	);
};

export default HistoryButton;
