import { useRef, useState } from 'react';
import Panel from '../Panel';

const OrganizationPanel = () => {
	const createOrganization = () => {
        
    };

	return (
		<Panel name='Organizations' startingPosition={{ x: 50, y: 650 }}>
			<div className='overflow-y-scroll bg-gray-100 w-full h-full px-4 py-4 flex flex-col gap-2 rounded-b-xl max-h-96'>
				<button className='bg-primary py-3 px-16 rounded-xl text-white font-bold hover:bg-[#8CB4FF]' onClick={() => createOrganization()}>
					Create Route
				</button>
			</div>
		</Panel>
	);
};

export default OrganizationPanel;
