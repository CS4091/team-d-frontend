import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Airport } from '@/interfaces/Airport';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { useContext, useEffect, useState } from 'react';
import Panel from '../Panel';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
	airports: Airport[];
	startingPosition: { x: number; y: number };
	setSelectingHomebase: (selectingHomebase: boolean) => void;
	openInventory: boolean;
	setOpenInventory: (openInventory: boolean) => void;
	homebase: string;
	setHomebase: (homebase: string) => void;
}

const InventoryPanel = ({ startingPosition, airports, setSelectingHomebase, openInventory, setOpenInventory, homebase, setHomebase }: Props) => {
	const { user, selectedOrganization } = useContext(UserContext);
	const [open, setOpen] = useState(false);
	const [manufacturer, setManufacturer] = useState('');
	const [model, setModel] = useState('');
	const [modelList, setModelList] = useState<string[]>([]);

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
			homebase
		})
			.then((resp) => {
				console.log(resp.data);
				setManufacturer('');
				setModel('');
				setHomebase('');
				setOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Panel name='Inventory' startingPosition={startingPosition}>
				<div className='overflow-y-scroll w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
					<DialogTrigger asChild>
						<Button className='w-full font-bold'>Manage Inventory</Button>
					</DialogTrigger>
				</div>
			</Panel>
			{selectedOrganization != '' && (
				<DialogContent className='sm:max-w-md bg-[#ffffff]'>
					<DialogHeader>
						<DialogTitle>Manage Inventory</DialogTitle>
						<DialogDescription className='font-merriweather'>Start typing an email to invite members</DialogDescription>
					</DialogHeader>
					<form className='mt-2'>
						<div className='flex flex-col w-full items-center gap-4'>
							<div className='flex flex-col gap-2 w-full'>
								<Label>Manufacturer</Label>
								<Input type='text' placeholder='Manufacturer' value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
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
								<Select
									value={homebase}
									onValueChange={(value) => {
										setHomebase(value);
									}}
								>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Select homebase' />
									</SelectTrigger>
									<SelectContent>
										{airports.map((air) => (
											<SelectItem key={air.id} value={air.id}>
												{air.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</form>
					<DialogFooter>
						<Button className='w-full font-bold' onClick={addPlane}>
							Add Plane
						</Button>
					</DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	);
};

export default InventoryPanel;
