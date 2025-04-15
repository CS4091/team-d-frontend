import api from '@/lib/axiosConfig';
import { UserContext } from '@/lib/context';
import { Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface OtherUser {
	email: string;
	id: string;
	name: string;
}

interface Props {
    selectedEmails: string[];
    setSelectedEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function EmailTagInput({selectedEmails, setSelectedEmails}: Props) {
	const [inputValue, setInputValue] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
    const [allEmails, setAllEmails] = useState<string[]>([]);
	const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

	const { user } = useContext(UserContext);

	useEffect(() => {
		api.get('/users')
			.then((resp) => {

				setAllEmails(
					resp.data
						.map((user: OtherUser) => user.email)
						.filter((email: string) => email !== user.email)
				);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const addEmail = (email: string) => {
		setSelectedEmails([...selectedEmails, email]);
		setInputValue('');
		setShowDropdown(false);
	};

	const removeEmail = (email: string) => {
		setSelectedEmails(selectedEmails.filter((e) => e !== email));
	};

	return (
		<div className='w-full max-w-md mx-auto'>
			{selectedEmails.length > 0 && (
				<div className='flex flex-wrap gap-2 mb-2'>
					{selectedEmails.map((email) => (
						<span
							key={email}
							className='flex items-center bg-neutral-200 px-3 py-1 rounded-full text-sm cursor-pointer hover:text-red-500 hover:bg-red-200'
							onClick={() => removeEmail(email)}
						>
							{email}
						</span>
					))}
				</div>
			)}

			{/* Input with search icon */}
			<Label htmlFor='email'>Search Emails</Label>
			<div className='relative'>
				<Search className='absolute left-3 top-2.5 h-5 w-5 text-neutral-500 z-20' />
				<Input
					type='text'
					className='pl-10 '
					placeholder='Type an email...'
					value={inputValue}
					onChange={(e) => {
                        setFilteredSuggestions(allEmails.filter((email: string) => email.toLowerCase().startsWith(e.target.value.toLowerCase()) && !selectedEmails.includes(email)));
						setInputValue(e.target.value);
						setShowDropdown(true);
					}}
					onFocus={() => setShowDropdown(true)}
					onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
				/>
			</div>

			{/* Dropdown */}
			{showDropdown && inputValue.length > 0 && filteredSuggestions.length > 0 && (
				<ul className='border mt-1 rounded shadow bg-white max-h-40 overflow-y-auto'>
					{filteredSuggestions.map((email) => (
						<li key={email} className='text-sm px-4 py-2 hover:bg-blue-100 cursor-pointer' onClick={() => addEmail(email)}>
							{email}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
