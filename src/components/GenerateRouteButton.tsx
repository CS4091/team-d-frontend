import { Airport } from '@/interfaces/Airport';
import { Route } from '@/interfaces/Route';
import api from '@/lib/axiosConfig';
import { WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Props {
	selectedOrganization: string;
	routeList: Route[];
}

interface GeneratedRoute {
	routing: {
		id: string[];
	};
	stats: {
		fuel: number;
	};
}

const GenerateRouteButton = ({ selectedOrganization, routeList }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
    const [routeData, setRouteData] = useState<GeneratedRoute | null>(null);

	const calculateRoute = () => {
		setLoading(true);
		const transformedArray = routeList.map((item) => ({
			from: item.from.id,
			to: item.to.id,
			passengers: item.passengers,
		}));
		api.post('/aviation/route', {
			organizationId: selectedOrganization,
			demand: transformedArray,
		})
			.then((resp) => {
				console.log(resp.data);
                setRouteData(resp.data)
				setLoading(false);
				setOpen(true);
			})
			.catch((err) => {
				console.log(err);
				if (err.response) {
					toast(err.response.data.message, { type: 'error' });
				}
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
				className="relative bg-gradient-to-r from-pink to-primary bg-[length:200%_200%] bg-[position:0%_50%] py-3 px-12 rounded-xl text-white font-bold transition-all duration-500 ease-in-out enabled:hover:bg-[position:100%_50%] enabled:hover:shadow-xl disabled:opacity-50"
			>
				{!loading && (
					<>
						<WandSparkles className="inline mr-2 relative z-10" size={20} />
						<span className="relative z-10">Generate Route</span>
					</>
				)}
				{loading && (
					<div className="flex items-center justify-center gap-2">
						<Oval visible={true} height="16" width="16" wrapperStyle={{}} wrapperClass="" strokeWidth={6} color={'white'} />
						<p>Generating</p>
					</div>
				)}
			</button>

			<DialogContent className="sm:max-w-md bg-[#ffffff]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Create Route</DialogTitle>
				</DialogHeader>

				<div className="mt-2">
					<div className="flex flex-col w-full items-center gap-4">
						<div className="flex flex-col gap-2 w-full">
							{/* <Label>Passengers</Label>
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
									}}
								>
									Select Path
								</Button>
							</div> */}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default GenerateRouteButton;
