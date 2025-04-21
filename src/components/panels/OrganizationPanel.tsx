import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { useContext, useState } from 'react';
import EmailTagInput from '../EmailTagInput';
import NewOrganization from '../NewOrganization';
import Panel from '../Panel';
import { Building } from 'lucide-react';
import { Options } from '../EmailTagInput';

const OrganizationPanel = ({ startingPosition }: { startingPosition: { x: number; y: number } }) => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');

	const [selectedEmails, setSelectedEmails] = useState<Options[]>([]);

	const { user, updateUser, updateSelectedOrganization, selectedOrganization } = useContext(UserContext);

	const inviteMembers = () => {
		api.post(`/organizations/${selectedOrganization}/invite`, {
			userId: selectedEmails.map((option: Options) => option.id)[0],
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
			<Panel name='Organizations' startingPosition={startingPosition} icon={<Building strokeWidth={1.5} />}>
				<div className='overflow-y-scroll w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl'>
					<div className='flex gap-2'>
						<Select
							value={selectedOrganization}
							onValueChange={(value) => {
								updateSelectedOrganization(value);
						
								localStorage.setItem('selectedOrganization', value);
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

						<NewOrganization />
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
