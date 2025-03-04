import { useRef, useState } from 'react';

const Draggable = ({ children }: { children: React.ReactNode }) => {
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const draggingRef = useRef(false);
	const offsetRef = useRef({ x: 0, y: 0 });

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		draggingRef.current = true;
		offsetRef.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!draggingRef.current) return;

		const container = document.documentElement;
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;
		const boxWidth = 350;
		const boxHeight = 50;

		const newX = Math.min(Math.max(e.clientX - offsetRef.current.x, 0), containerWidth - boxWidth);
		const newY = Math.min(Math.max(e.clientY - offsetRef.current.y, 0), containerHeight - boxHeight);

		setPosition({ x: newX, y: newY });
	};

	const handleMouseUp = () => {
		draggingRef.current = false;

		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	};

	return (
		<div style={{ left: `${position.x}px`, top: `${position.y}px` }} onMouseDown={handleMouseDown}>
			{children}
		</div>
	);
};

export default Draggable;
