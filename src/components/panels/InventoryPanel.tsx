import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import Panel from '../Panel';

const InventoryPanel = () => {
	return (
		<Panel name='Inventory' startingPosition={{ x: 50, y: 300 }}>
			<div className='overflow-y-scroll bg-gray-100 w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
				<p>Time (mins)</p>
				<Input type='number' min={0} />
				<p>Fuel</p>
				<Input type='number' min={0} />
				<p>Personnel</p>
				<Input type='number' min={0} />
			</div>
		</Panel>
	);
};

export default InventoryPanel;
