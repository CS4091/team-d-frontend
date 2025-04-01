import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/axiosConfig';
import { useState } from 'react';
import Panel from '../Panel';

const OrganizationPanel = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	const createOrganization = () => {
		api.post('/organizations', {
			name
		})
			.then((resp) => {
				console.log(resp);
                setOpen(false)
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Panel name='Organizations' startingPosition={{ x: 50, y: 650 }}>
				<div className='overflow-y-scroll bg-gray-100 w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
					<DialogTrigger asChild>
						<Button className='w-full font-bold'>Create Organization</Button>
					</DialogTrigger>
				</div>
			</Panel>
			<DialogContent className='sm:max-w-md bg-[#ffffff]'>
				<DialogHeader>
					<DialogTitle>New Organization</DialogTitle>
					<DialogDescription className='font-merriweather'>
						Get started by creating a name for your organization and inviting members
					</DialogDescription>
				</DialogHeader>
				<form>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' placeholder='Name of your organization' value={name} onChange={(e) => setName(e.target.value)} />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='email'>Invite Members</Label>
							<Input id='email' placeholder="Enter your member's emails" value={email} onChange={(e) => setEmail(e.target.value)} />
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

export default OrganizationPanel;
