import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { Building, Trash } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
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

	const { user, updateUser, updateSelectedOrganization, selectedOrganization } = useContext(UserContext);

	useEffect(() => {
		api.get(`/organizations/${selectedOrganization}`)
			.then((resp) => {
				console.log(resp.data);
				setPendingInvites(resp.data.activeInvites);
				setMembers(resp.data.users);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [selectedOrganization]);

    const removeMember = (member: Member) => {
        return
    }

    const removePending = (member: Member) => {
        return
    }
    

	const inviteMembers = () => {
		api.post(`/organizations/${selectedOrganization}/invite`, {
			userId: selectedEmails.map((option: Options) => option.id)[0]
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

					<form className='mt-2 flex flex-col gap-2'>
						<div className='grid w-full items-center gap-4'>
							<EmailTagInput selectedEmails={selectedEmails} setSelectedEmails={setSelectedEmails} />
						</div>
						<Button className='w-full font-bold' onClick={inviteMembers} disabled={selectedEmails.length == 0}>
							Invite Members
						</Button>
					</form>
					<div>
						<p className='text-xl font-bold mb-2'>Members</p>
						<Input type='text' placeholder='Search for member...' />
						{members.map((member) => (
							<div className='flex items-center border-b-2 justify-between'>
								<div className='flex flex-col py-2 px-6'>
									<p className='font-semibold'>{member.name}</p>
									<p className='text-sm -mt-1'>{member.email}</p>
								</div>
								<div className='p-2 px-4 rounded-lg bg-neutral-200 border border-neutral-300 hover:bg-neutral-300 cursor-pointer' onClick={() => removeMember(member)}>
									<Trash size={20} className='text-red-400' />
								</div>
							</div>
						))}
						{pendingInvites.map((inv) => (
							<div className='flex items-center justify-between border-b-2'>
								<div className='flex flex-col py-2 px-6'>
									<p className='font-semibold'>{inv.user.name}</p>
									<p className='text-sm -mt-1'>{inv.user.email}</p>
								</div>
								<p className='text-sm'>Pending</p>
                                <div className='p-2 px-4 rounded-lg bg-neutral-200 border border-neutral-300 hover:bg-neutral-300 cursor-pointer' onClick={() => removePending(inv.user)}>
									<Trash size={20} className='text-red-400' />
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
