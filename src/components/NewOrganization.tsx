import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { Plus } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

const NewOrganization = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');

	const { updateUser } = useContext(UserContext);

	const createOrganization = () => {
		api.post('/organizations', {
			name
		})
			.then((resp) => {
				console.log(resp);
				updateUser();
				setOpen(false);
				toast('Organization has been created!', { type: 'success' });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button className='w-fit font-bold gap-1' variant='secondary' onClick={() => setOpen(true)}>
				<Plus strokeWidth={3} />
				New
			</Button>

			<DialogContent className='sm:max-w-md bg-[#ffffff]'>
				<DialogHeader>
					<DialogTitle>New Organization</DialogTitle>
					<DialogDescription className='font-merriweather'>Get started by creating a name for your organization</DialogDescription>
				</DialogHeader>
				<form className='mt-2'>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' placeholder='Name of your organization' value={name} onChange={(e) => setName(e.target.value)} />
						</div>
					</div>
				</form>
				<DialogFooter>
					<Button className='w-full font-bold' onClick={createOrganization} disabled={name == ''}>
						Create Organization
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default NewOrganization;
