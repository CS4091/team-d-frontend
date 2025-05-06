import { UserContext } from '@/lib/context';
import { Building, Plane, Route, Search } from 'lucide-react';
import { useContext } from 'react';

interface Props {
	openRoutesPanel: boolean;
	openInventoryPanel: boolean;
	openOrganizationPanel: boolean;
    openSearchPanel: boolean;
	setOpenRoutesPanel: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenInventoryPanel: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenOrganizationPanel: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenSearchPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const Taskbar = ({
	openRoutesPanel,
	openInventoryPanel,
	openOrganizationPanel,
    openSearchPanel,
	setOpenRoutesPanel,
	setOpenInventoryPanel,
	setOpenOrganizationPanel,
    setOpenSearchPanel
}: Props) => {
	const { selectedOrganization } = useContext(UserContext);

	return (
		<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2  border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:rounded-2xl z-[48] p-4 flex gap-4">
			<button
				className="rounded-full p-2 inset-0 z-0 hover:bg-gradient-to-br from-white/20 to-white/5 transition-all group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
				onClick={() => setOpenOrganizationPanel(!openOrganizationPanel)}
			>
				<Building size={24} color={openOrganizationPanel ? 'white' : 'gray'} />
			</button>
			<button
				className="rounded-full p-2  inset-0 z-0 enabled:hover:bg-gradient-to-br from-white/20 to-white/5 transition-all enabled:group-hover:opacity-100 enabled:hover:scale-105 enabled:active:scale-95 enabled:cursor-pointer"
				onClick={() => setOpenRoutesPanel(!openRoutesPanel)}
				disabled={selectedOrganization == ''}
			>
				<Route size={24} color={openRoutesPanel && selectedOrganization != "" ? 'white' : 'gray'} />
			</button>
			<button
				className="rounded-full p-2 inset-0 z-0 enabled:hover:bg-gradient-to-br from-white/20 to-white/5 transition-all enabled:group-hover:opacity-100 enabled:hover:scale-105 enabled:active:scale-95 enabled:cursor-pointer"
				onClick={() => setOpenInventoryPanel(!openInventoryPanel)}
				disabled={selectedOrganization == ''}
			>
				<Plane size={24} color={openInventoryPanel && selectedOrganization != ""  ? 'white' : 'gray'} />
			</button>
			<button
				className="rounded-full p-2 inset-0 z-0 enabled:hover:bg-gradient-to-br from-white/20 to-white/5 transition-all enabled:group-hover:opacity-100 enabled:hover:scale-105 enabled:active:scale-95 enabled:cursor-pointer"
				onClick={() => setOpenSearchPanel(!openSearchPanel)}
				disabled={selectedOrganization == ''}
			>
				<Search size={24} color={openSearchPanel && selectedOrganization != ""  ? 'white' : 'gray'} />
			</button>
		</div>
	);
};

export default Taskbar;
