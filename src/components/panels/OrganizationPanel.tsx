import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { Building, Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import EmailTagInput, { Options } from '../EmailTagInput';
import NewOrganization from '../NewOrganization';
import Panel from '../Panel';
import { Input } from '../ui/input';

export interface Member {
	name: string;
	id: string;
	email: string;
}

export interface Invite {
	userId: string;
	token: string;
	orgId: string;
	createdAt: string;
	organization: {
		name: string;
		id: string;
	};
	user: Member;
}

const OrganizationPanel = ({ startingPosition }: { startingPosition: { x: number; y: number } }) => {
	const [open, setOpen] = useState(false);
	const [selectedEmails, setSelectedEmails] = useState<Options[]>([]);
	const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
	const [members, setMembers] = useState<Member[]>([]);
	const [searchValue, setSearchValue] = useState('');

	const { user, updateSelectedOrganization, selectedOrganization } = useContext(UserContext);

	useEffect(() => {
		api.get(`/organizations/${selectedOrganization}`)
			.then((resp) => {
				setPendingInvites(resp.data.activeInvites);
				setMembers(resp.data.users);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [selectedOrganization]);

	const removePending = (id: string, token: string) => {
		api.delete(`/organizations/${id}/invite/${token}`)
			.then((resp) => {
				setPendingInvites(pendingInvites.filter((inv) => inv.token != token));
			})
			.catch((err) => {
				console.log(err);
			});
		return;
	};

	const inviteMembers = () => {
		api.post(`/organizations/${selectedOrganization}/invite`, {
			userIds: selectedEmails.map((option: Options) => option.id)
		})
			.then((resp) => {
				api.get(`/organizations/${selectedOrganization}`)
					.then((resp) => {
						setSelectedEmails([]);
						setPendingInvites(resp.data.activeInvites);
						toast('Invite(s) have been sent out!', { type: 'success' });
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					setSelectedEmails([]);
				}
			}}
		>
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
								{user?.organizations?.map((org) => (
									<SelectItem key={org.id} value={org.id}>
										{org.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<NewOrganization />
					</div>

					{selectedOrganization != '' && (
						<Button className='w-full font-bold' onClick={() => setOpen(true)}>
							Manage Organization
						</Button>
					)}
				</div>
			</Panel>
			{selectedOrganization != '' && (
				<DialogContent className='sm:max-w-md bg-[#ffffff]'>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold'>Manage Organization</DialogTitle>
					</DialogHeader>

					<div className='mt-2 flex flex-col gap-2'>
						<p className='text-lg font-semibold'>Invite Members</p>
						<div className='grid w-full items-center gap-4'>
							<EmailTagInput
								selectedEmails={selectedEmails}
								setSelectedEmails={setSelectedEmails}
								pendingInvites={pendingInvites}
								members={members}
							/>
						</div>
						<Button className='w-full font-bold' onClick={inviteMembers} disabled={selectedEmails.length == 0}>
							Send Invites
						</Button>
					</div>
					<div>
						<p className='text-lg font-semibold mb-2'>Members</p>
						<div className='relative'>
							<Search className='absolute left-3 top-2.5 h-5 w-5 text-neutral-500 z-20' />
							<Input
								type='text'
								className='pl-10 '
								placeholder='Search for members...'
								value={searchValue}
								onChange={(e) => {
									setSearchValue(e.target.value.toLowerCase());
								}}
							/>
						</div>

						{pendingInvites &&
							pendingInvites
								.filter((inv) => inv.user.name.toLowerCase().startsWith(searchValue))
								.map((inv) => (
									<div key={inv.user.id} className='flex items-center border-b px-2 py-2'>
										<div className='flex flex-col flex-grow min-w-0 px-4 max-w-56'>
											<p className='font-semibold break-words'>{inv.user.name}</p>
											<p className='text-sm break-words -mt-1'>{inv.user.email}</p>
										</div>

										<div className='flex items-center space-x-4 flex-shrink-0 ml-4'>
											<p className='text-sm whitespace-nowrap'>Pending</p>
											<Button
												variant='destructive'
												size='sm'
												className='whitespace-nowrap'
												onClick={() => removePending(inv.orgId, inv.token)}
											>
												Cancel
											</Button>
										</div>
									</div>
								))}
						{members &&
							members
								.filter((mem) => mem.name.toLowerCase().startsWith(searchValue))
								.map((member) => (
									<div className='flex items-center border-b' key={member.id}>
										<div className='flex flex-col py-2 px-6 max-w-96'>
											<p className='font-semibold break-words'>{member.name}</p>
											<p className='text-sm -mt-1 break-words'>{member.email}</p>
										</div>
									</div>
								))}
					</div>
					<DialogFooter></DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	);
};

export default OrganizationPanel;
