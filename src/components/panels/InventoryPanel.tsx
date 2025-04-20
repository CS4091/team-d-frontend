import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asset } from '@/interfaces/Asset';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { Archive } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import Panel from '../Panel';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
	startingPosition: { x: number; y: number };
	setSelectingHomebase: (selectingHomebase: boolean) => void;
	openInventory: boolean;
	setOpenInventory: (openInventory: boolean) => void;
	homebase: { name: string; id: string };
	setHomebase: (homebase: { name: string; id: string }) => void;
}

const InventoryPanel = ({ startingPosition, setSelectingHomebase, openInventory, setOpenInventory, homebase, setHomebase }: Props) => {
	const { user, selectedOrganization } = useContext(UserContext);
	const [manufacturer, setManufacturer] = useState('');
	const [model, setModel] = useState('');
	const [modelList, setModelList] = useState<string[]>(['B733', 'B741', 'A320', 'A332']);
	const [inventory, setInventory] = useState<Asset[]>([]);
	const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

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
		api.get('/aviation/planes')
			.then((resp) => {
				setModelList(resp.data.map((plane: any) => plane.model));
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const addPlane = () => {
		api.post(`/organizations/${selectedOrganization}/assets`, {
			manufacturer,
			model,
			homeBase: homebase.id
		})
			.then((resp) => {
				setInventory((prev) => [...prev, resp.data]);
				console.log(resp.data);
				setManufacturer('');
				setModel('');
				setHomebase({ name: '', id: '' });
				setOpenInventory(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const removePlane = (index: number) => {
		setInventory((prevList) => prevList.filter((_, i) => i !== index));

		// TODO: endpoint to remove plane from inventory
	};

	return (
		<Dialog open={openInventory} onOpenChange={setOpenInventory}>
			<Panel name='Inventory' startingPosition={startingPosition} icon={<Archive strokeWidth={1.5} />}>
				<div className='overflow-y-scroll w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl'>
					<DialogTrigger asChild>
						<Button className='w-full font-bold'>New Plane</Button>
					</DialogTrigger>
					{inventory.map((asset, i) => (
						<div key={asset.id} onMouseEnter={() => setHoveredRoute(i)} onMouseLeave={() => setHoveredRoute(null)} onClick={() => removePlane(i)}>
							<div
								className={`flex bg-gray-200 px-4 py-2 rounded-xl gap-5 items-center relative cursor-pointer transition-all duration-200 ${
									hoveredRoute === i ? 'bg-red-500 opacity-60' : ''
								}`}
							>
								<p className='text-lg py-2 font-bold'>{i + 1}</p>
								<div className='flex flex-col'>
									<div className='flex gap-1'>
										<p className='font-bold'>{asset.manufacturer} - </p>
										<p className='font-bold font-merriweather'>{asset.model}</p>
									</div>
									<p className='text-sm font-medium'>{asset.homeBase}</p>
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
									}}
								>
									<FaTrashCan color='white' size={24} className='shadow-2xl' />
								</div>
							)}
						</div>
					))}
				</div>
			</Panel>
			<DialogContent className='sm:max-w-md bg-[#ffffff]'>
				<DialogHeader>
					<DialogTitle>New Plane</DialogTitle>
					<DialogDescription className='font-merriweather'>Enter the details of your plane</DialogDescription>
				</DialogHeader>
				<div className='mt-2'>
					<div className='flex flex-col w-full items-center gap-4'>
						<div className='flex flex-col gap-2 w-full'>
							<Label>Manufacturer</Label>
							<Input type='text' placeholder='Enter manufacturer name' value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<Label>Model</Label>
							<Select
								value={model}
								onValueChange={(value) => {
									setModel(value);
								}}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select model' />
								</SelectTrigger>
								<SelectContent>
									{modelList.map((mod) => (
										<SelectItem key={mod} value={mod}>
											{mod}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className='flex flex-col gap-2 w-full'>
							<Label>Homebase</Label>
							<div className='flex items-center gap-2'>
								<Input
									value={homebase.name}
									readOnly={true}
									disabled={homebase.name == ''}
									placeholder='No airport selected'
									className='w-full'
								/>
								<Button
									variant={'secondary'}
									onClick={() => {
										setSelectingHomebase(true);
										setOpenInventory(false);
									}}
								>
									Select Airport
								</Button>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button className='w-full font-bold' onClick={addPlane}>
						Add Plane
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default InventoryPanel;
