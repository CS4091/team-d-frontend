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

export interface Options {
    email: string;
    id: string;
}

interface Props {
    selectedEmails: Options[];
    setSelectedEmails: React.Dispatch<React.SetStateAction<Options[]>>;
}

export default function EmailTagInput({selectedEmails, setSelectedEmails}: Props) {
	const [inputValue, setInputValue] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
    const [allEmails, setAllEmails] = useState<Options[]>([]);
	const [filteredSuggestions, setFilteredSuggestions] = useState<Options[]>([]);

	const { user } = useContext(UserContext);

	useEffect(() => {
		api.get('/users')
			.then((resp) => {

				setAllEmails(
					resp.data
						.map((user: OtherUser) => ({email: user.email, id: user.id}))
						.filter((eml: Options) => eml.email !== user.email)
				);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const addEmail = (option: Options) => {
		setSelectedEmails([...selectedEmails, option]);
		setInputValue('');
		setShowDropdown(false);
	};

	const removeEmail = (email: string) => {
		setSelectedEmails(selectedEmails.filter((e) => e.email !== email));
	};

	return (
		<div className='w-full max-w-md mx-auto'>
			{selectedEmails.length > 0 && (
				<div className='flex flex-wrap gap-2 mb-2'>
					{selectedEmails.map((option: Options) => (
						<span
							key={option.email}
							className='flex items-center bg-neutral-200 px-3 py-1 rounded-full text-sm cursor-pointer hover:text-red-500 hover:bg-red-200'
							onClick={() => removeEmail(option.email)}
						>
							{option.email}
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
                        setFilteredSuggestions(allEmails.filter((option: Options) => option.email.toLowerCase().startsWith(e.target.value.toLowerCase()) && !selectedEmails.includes(option)));
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
					{filteredSuggestions.map((option: Options) => (
						<li key={option.email} className='text-sm px-4 py-2 hover:bg-blue-100 cursor-pointer' onClick={() => addEmail(option)}>
							{option.email}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
