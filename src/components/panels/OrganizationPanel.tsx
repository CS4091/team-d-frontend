import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { useContext, useState } from 'react';
import Panel from '../Panel';

const OrganizationPanel = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [selectedOrganization, setSelectedOrganization] = useState('create');

	const { user, updateUser } = useContext(UserContext);

	const createOrganization = () => {
		api.post('/organizations', {
			name
		})
			.then((resp) => {
				console.log(resp);
				updateUser();
				setOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Panel name='Organizations' startingPosition={{ x: 50, y: 650 }}>
				<div className='overflow-y-scroll w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
					<Label>Current Organization</Label>
					<Select value={selectedOrganization} onValueChange={(value) => setSelectedOrganization(value)}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Select organization' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='create' className='font-bold'>
								Create New Organization
							</SelectItem>
							{user?.organizations.map((org) => (
								<SelectItem key={org.id} value={org.id}>
									{org.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{selectedOrganization == 'create' && (
						<DialogTrigger asChild>
							<Button className='w-full font-bold'>Create Organization</Button>
						</DialogTrigger>
					)}
					{selectedOrganization != 'create' && selectedOrganization != '' && (
						<DialogTrigger asChild>
							<Button className='w-full font-bold'>Invite Members</Button>
						</DialogTrigger>
					)}
				</div>
			</Panel>
			{selectedOrganization == 'create' && <DialogContent className='sm:max-w-md bg-[#ffffff]'>
				<DialogHeader>
					<DialogTitle>New Organization</DialogTitle>
					<DialogDescription className='font-merriweather'>Get started by creating a name for your organization</DialogDescription>
				</DialogHeader>
				<form>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' placeholder='Name of your organization' value={name} onChange={(e) => setName(e.target.value)} />
						</div>
						{/* <div className='flex flex-col space-y-1.5'>
							<Label htmlFor='email'>Invite Members</Label>
							<Input id='email' placeholder="Enter your member's emails" value={email} onChange={(e) => setEmail(e.target.value)} />
						</div> */}
					</div>
				</form>
				<DialogFooter>
					<Button className='w-full font-bold' onClick={createOrganization} disabled={name == ''}>
						Create Organization
					</Button>
				</DialogFooter>
			</DialogContent>}
			{selectedOrganization != 'create' && selectedOrganization != '' && <DialogContent className='sm:max-w-md bg-[#ffffff]'>
				<DialogHeader>
					<DialogTitle>Invite Members</DialogTitle>
					<DialogDescription className='font-merriweather'>Enter an email to invite members</DialogDescription>
				</DialogHeader>
				<form>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Email Address</Label>
							<Input id='name' placeholder='Enter email address' value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						{/* <div className='flex flex-col space-y-1.5'>
							<Label htmlFor='email'>Invite Members</Label>
							<Input id='email' placeholder="Enter your member's emails" value={email} onChange={(e) => setEmail(e.target.value)} />
						</div> */}
					</div>
				</form>
				<DialogFooter>
					<Button className='w-full font-bold' onClick={createOrganization} disabled={name == ''}>
						Invite Members
					</Button>
				</DialogFooter>
			</DialogContent>}
		</Dialog>
	);
};

export default OrganizationPanel;
