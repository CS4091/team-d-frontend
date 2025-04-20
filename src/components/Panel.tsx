import Draggable from '@/components/Draggable';
import { Resizable } from 're-resizable';
import React, { ReactNode, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

interface Coords {
	x: number;
	y: number;
}

interface Props {
	name: string;
	children: ReactNode;
	startingPosition: Coords;
	icon: ReactNode;
}

const Panel = ({ name, children, startingPosition, icon }: Props) => {
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
			{openPanel && (
				<Resizable
					minHeight={openPanel ? 130 : 56}
					maxHeight={'75vh'}
					maxWidth={450}
					defaultSize={{ width: 320, height: openPanel ? 'auto' : 56 }}
					className='z-10 bg-white w-1/6 min-w-80 flex flex-col shadow rounded-xl'
					enable={{
						bottomRight: openPanel
					}}
					handleStyles={{
						bottomRight: {
							width: '16px',
							height: '16px',
							position: 'absolute',
							bottom: 4,
							right: 4,
							cursor: 'nwse-resize',
							zIndex: 50,
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='8' y1='12' x2='12' y2='8' stroke='%234b5563' stroke-width='1' /%3E%3Cline x1='4' y1='12' x2='12' y2='4' stroke='%234b5563' stroke-width='1' /%3E%3Cline x1='0' y1='12' x2='12' y2='0' stroke='%234b5563' stroke-width='1' /%3E%3C/svg%3E")`,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center',
							backgroundSize: '16px 16px'
						}
					}}
					handleClasses={{
						bottomRight: 'resizable-handle'
					}}
				>
					<div
						className={`${openPanel ? 'border-b-2 border-slate-200' : 'rounded-b-xl'} flex justify-between items-center px-4 py-4 cursor-pointer`}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onClick={handleClick}
					>
						<div className='flex gap-2'>
							{icon}
							<p className='font-medium'>{name}</p>
						</div>
						{openPanel && <FaChevronDown />}
						{!openPanel && <FaChevronUp />}
					</div>
					{openPanel && <>{children}</>}
				</Resizable>
			)}
			{!openPanel && (
				<div className='z-10 bg-white w-1/6 min-w-80 flex flex-col shadow rounded-xl h-[56px]'>
					<div
						className={`${openPanel ? 'border-b-2 border-slate-200' : 'rounded-b-xl'} flex justify-between items-center px-4 py-4 cursor-pointer`}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onClick={handleClick}
					>
						<div className='flex gap-2'>
							{icon}
							<p className='font-medium'>{name}</p>
						</div>
						{openPanel && <FaChevronDown />}
						{!openPanel && <FaChevronUp />}
					</div>
					{openPanel && <>{children}</>}
				</div>
			)}
		</Draggable>
	);
};

export default Panel;
