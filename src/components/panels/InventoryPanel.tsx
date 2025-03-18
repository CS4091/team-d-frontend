import Draggable from '@/components/Draggable';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

const InventoryPanel = () => {
	const [openInventory, setOpenInventory] = useState(true);

	const wasDragged = useRef(false);

	const handleMouseDown = () => {
		wasDragged.current = false;
	};

	const handleMouseMove = () => {
		wasDragged.current = true;
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (wasDragged.current) {
			e.stopPropagation();
			return;
		}
		setOpenInventory(!openInventory);
	};

	return (
		<Draggable startingPosition={{ x: 50, y: 300 }}>
			<div className='absolute z-10 bg-white w-1/6 min-w-80 flex flex-col shadow rounded-xl'>
				<div
					className='cursor-pointer rounded-b-xl flex justify-between items-center px-4 py-4'
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onClick={handleClick}
				>
					<p className='font-medium'>Inventory</p>
					{openInventory && <FaChevronDown />}
					{!openInventory && <FaChevronUp />}
				</div>
				{openInventory && (
					<div className='overflow-y-scroll bg-gray-100 w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
						<p>Time (mins)</p>
						<Input type='number' min={0} />
						<p>Fuel</p>
						<Input type='number' min={0} />
						<p>Personnel</p>
						<Input type='number' min={0} />
					</div>
				)}
			</div>
		</Draggable>
	);
};

export default InventoryPanel;
