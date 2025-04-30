import { Building, Plane, Route } from 'lucide-react';

interface Props {
	openRoutesPanel: boolean;
	openInventoryPanel: boolean;
	openOrganizationPanel: boolean;
	setOpenRoutesPanel: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenInventoryPanel: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenOrganizationPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const Taskbar = ({
	openRoutesPanel,
	openInventoryPanel,
	openOrganizationPanel,
	setOpenRoutesPanel,
	setOpenInventoryPanel,
	setOpenOrganizationPanel,
}: Props) => {
	return (
		<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2  border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:rounded-2xl z-[48] p-4 flex gap-4">
			<div
				className="rounded-full p-2 inset-0 z-0 hover:bg-gradient-to-br from-white/20 to-white/5 transition-all group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
				onClick={() => setOpenOrganizationPanel(!openOrganizationPanel)}
			>
				<Building size={24} color={openOrganizationPanel ? 'white' : 'gray'} />
			</div>
			<div
				className="rounded-full p-2  inset-0 z-0 hover:bg-gradient-to-br from-white/20 to-white/5 transition-all group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
				onClick={() => setOpenRoutesPanel(!openRoutesPanel)}
			>
				<Route size={24} color={openRoutesPanel ? 'white' : 'gray'} />
			</div>
			<div
				className="rounded-full p-2  inset-0 z-0 hover:bg-gradient-to-br from-white/20 to-white/5 transition-all group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
				onClick={() => setOpenInventoryPanel(!openInventoryPanel)}
			>
				<Plane size={24} color={openInventoryPanel ? 'white' : 'gray'} />
			</div>
		</div>
	);
};

export default Taskbar;
