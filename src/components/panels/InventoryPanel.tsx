import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Airplane } from '@/interfaces/Airplane';
import { Asset } from '@/interfaces/Asset';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { Plane } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import Panel from '../Panel';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'react-toastify';

interface Props {
	startingPosition: { x: number; y: number };
	setSelectingHomebase: (selectingHomebase: boolean) => void;
	openInventory: boolean;
	setOpenInventory: (openInventory: boolean) => void;
	homebase: { name: string; id: string };
	setHomebase: (homebase: { name: string; id: string }) => void;
	model: Airplane | null;
	setModel: (model: Airplane | null) => void;
	inventory: Asset[];
	setInventory: React.Dispatch<React.SetStateAction<Asset[]>>;
}

const InventoryPanel = ({
	startingPosition,
	setSelectingHomebase,
	openInventory,
	setOpenInventory,
	homebase,
	setHomebase,
	model,
	setModel,
	inventory,
	setInventory,
}: Props) => {
	const { user, selectedOrganization } = useContext(UserContext);
	const [manufacturer, setManufacturer] = useState('');

	const [modelList, setModelList] = useState<Airplane[]>([]);
	const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

	useEffect(() => {
		api.get('/aviation/planes')
			.then((resp) => {
				setModelList(resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const addPlane = () => {
		api.post(`/organizations/${selectedOrganization}/assets`, {
			manufacturer,
			model: model?.model,
			homeBase: homebase.id,
		})
			.then((resp) => {
				setInventory((prev) => [...prev, resp.data]);
				setManufacturer('');
				setModel(null);
				setHomebase({ name: '', id: '' });
				setOpenInventory(false);
				toast('Successfully created new plane!', { type: 'success' });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const removePlane = (id: string) => {
		setInventory((prevList) => prevList.filter((asset) => asset.id !== id));
		api.delete(`/organizations/${selectedOrganization}/assets/${id}`)
			.then((resp) => {})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Dialog
			open={openInventory}
			onOpenChange={(open) => {
				setOpenInventory(open);
				if (!open) {
					setManufacturer('');
					setModel(null);
					setHomebase({ name: '', id: '' });
				}
			}}
		>
			<Panel name="Inventory" startingPosition={startingPosition} icon={<Plane strokeWidth={1.5} />}>
				<div className="overflow-y-scroll w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl">
					<DialogTrigger asChild>
						<Button className="w-full font-bold">New Plane</Button>
					</DialogTrigger>
					{inventory.map((asset, i) => (
						<div
							key={asset.id}
							onMouseEnter={() => setHoveredRoute(i)}
							onMouseLeave={() => setHoveredRoute(null)}
							onClick={() => removePlane(asset.id)}
						>
							<div
								className={`flex bg-gray-200 px-4 py-2 rounded-xl gap-5 items-center relative cursor-pointer transition-all duration-200 ${
									hoveredRoute === i ? 'bg-red-500 opacity-60' : ''
								}`}
							>
								<p className="text-lg py-2 font-bold">{i + 1}</p>
								<div className="flex flex-col">
									<div className="flex gap-1">
										<p className="font-bold">{asset.manufacturer} - </p>
										<p className="font-bold font-merriweather">{asset.model}</p>
									</div>
									<p className="text-sm font-medium">{asset.homeBase}</p>
								</div>
							</div>
							{hoveredRoute === i && (
								<div
									style={{
										position: 'absolute',
										left: '50%',
										top: '50%',
										transform: 'translateY(-50%) translateX(-50%)',
										cursor: 'pointer',
									}}
								>
									<FaTrashCan color="white" size={24} className="shadow-2xl" />
								</div>
							)}
						</div>
					))}
				</div>
			</Panel>
			<DialogContent className="sm:max-w-md bg-[#ffffff]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">New Plane</DialogTitle>
				</DialogHeader>
				<div className="mt-2">
					<div className="flex flex-col w-full items-center gap-4">
						<div className="flex flex-col gap-2 w-full">
							<Label>Manufacturer</Label>
							<Input type="text" placeholder="Enter manufacturer name" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
						</div>
						<div className="flex flex-col gap-2 w-full">
							<Label>Model</Label>
							<Select
								value={model ? JSON.stringify(model) : ''}
								onValueChange={(value) => {
									setModel(JSON.parse(value));
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select model" />
								</SelectTrigger>
								<SelectContent>
									{modelList.map((mod) => (
										<SelectItem key={mod.model} value={JSON.stringify(mod)}>
											{mod.model}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-2 w-full">
							<Label>Homebase</Label>
							<div className="flex items-center gap-2">
								<Input
									value={homebase.name}
									readOnly={true}
									disabled={homebase.name == ''}
									placeholder="No airport selected"
									className="w-full"
								/>
								<Button
									variant={'secondary'}
									onClick={() => {
										setSelectingHomebase(true);
										setOpenInventory(false);
									}}
									disabled={!model}
								>
									Select Airport
								</Button>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button className="w-full font-bold" onClick={addPlane}>
						Add Plane
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default InventoryPanel;
