import Draggable from '@/components/Draggable';
import { ReactNode, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

interface Coords {
    x: number;
    y: number;
}

interface Props {
	name: string;
	children: ReactNode;
    startingPosition: Coords;
}

const Panel = ({ name, children, startingPosition }: Props) => {
	const [openPanel, setOpenPanel] = useState(true);

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
		setOpenPanel(!openPanel);
	};
    
	return (
		<Draggable startingPosition={startingPosition}>
			<div className='absolute z-10 bg-white w-1/6 min-w-80 flex flex-col shadow rounded-xl'>
				<div
					className={`cursor-pointer ${openPanel ? 'border-b-2 border-slate-200' : 'rounded-b-xl'} flex justify-between items-center px-4 py-4`}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onClick={handleClick}
				>
					<p className='font-medium'>{name}</p>
					{openPanel && <FaChevronDown />}
					{!openPanel && <FaChevronUp />}
				</div>
				{openPanel && <>{children}</>}
			</div>
		</Draggable>
	);
};

export default Panel;
