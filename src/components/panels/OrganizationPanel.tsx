import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { useContext, useState } from 'react';
import EmailTagInput from '../EmailTagInput';
import Panel from '../Panel';
import { Plus } from 'lucide-react';
import NewOrganization from '../NewOrganization';

const OrganizationPanel = ({ startingPosition }: {startingPosition: {x: number, y: number}}) => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [selectedOrganization, setSelectedOrganization] = useState('');
	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

	const { user, updateUser, updateSelectedOrganization } = useContext(UserContext);

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
			<Panel name='Organizations' startingPosition={startingPosition}>
				<div className='overflow-y-scroll w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl'>
					<div className='flex gap-2'>
						<Select
							value={selectedOrganization}
							onValueChange={(value) => {
								updateSelectedOrganization(value), setSelectedOrganization(value);
							}}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Select organization' />
							</SelectTrigger>
							<SelectContent>
								{user?.organizations.map((org) => (
									<SelectItem key={org.id} value={org.id}>
										{org.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<NewOrganization/>
					</div>

					{selectedOrganization != '' && (
						<DialogTrigger asChild>
							<Button className='w-full font-bold'>Manage Organization</Button>
						</DialogTrigger>
					)}
				</div>
			</Panel>
			{selectedOrganization != '' && (
				<DialogContent className='sm:max-w-md bg-[#ffffff]'>
					<DialogHeader>
						<DialogTitle>Manage Organization</DialogTitle>
						<DialogDescription className='font-merriweather'>Start typing an email to invite members</DialogDescription>
					</DialogHeader>
					<form className='mt-2'>
						<div className='grid w-full items-center gap-4'>
							<EmailTagInput selectedEmails={selectedEmails} setSelectedEmails={setSelectedEmails} />
						</div>
					</form>
					<DialogFooter>
						<Button className='w-full font-bold' onClick={inviteMembers} disabled={selectedEmails.length == 0}>
							Invite Members
						</Button>
					</DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	);
};

export default OrganizationPanel;
