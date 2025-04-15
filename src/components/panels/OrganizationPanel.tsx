import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { useContext, useState } from 'react';
import Panel from '../Panel';
import EmailTagInput from '../EmailTagInput';


const OrganizationPanel = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [selectedOrganization, setSelectedOrganization] = useState('create');
	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

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

    const inviteMembers = () => {
        api.post('/organizations/invite', {
            emails: selectedEmails,
            organizationId: selectedOrganization
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
				<form className='mt-2'>
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
					<DialogDescription className='font-merriweather'>Start typing an email to invite members</DialogDescription>
				</DialogHeader>
				<form className='mt-2'>
					<div className='grid w-full items-center gap-4'>
                        <EmailTagInput selectedEmails={selectedEmails} setSelectedEmails={setSelectedEmails}/>
					</div>
				</form>
				<DialogFooter>
					<Button className='w-full font-bold' onClick={inviteMembers} disabled={selectedEmails.length == 0}>
						Invite Members
					</Button>
				</DialogFooter>
			</DialogContent>}
		</Dialog>
	);
};

export default OrganizationPanel;
