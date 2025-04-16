import { useRef, useState } from 'react';

type Coords = { x: number; y: number };

const Draggable = ({ startingPosition, children }: { startingPosition: Coords; children: React.ReactNode }) => {
	const [position, setPosition] = useState(startingPosition);
	const draggingRef = useRef(false);
	const offsetRef = useRef({ x: 0, y: 0 });
	const boxRef = useRef<HTMLDivElement>(null);

	const getNavbarRect = () => {
		const navbar = document.querySelector('nav');
		return navbar?.getBoundingClientRect() ?? null;
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		draggingRef.current = true;

		const rect = boxRef.current?.getBoundingClientRect();
		if (!rect) return;

		offsetRef.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!draggingRef.current) return;

		const container = document.documentElement;
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		const boxWidth = 320;
		const boxHeight = boxRef.current?.offsetHeight ?? 200;

		const rawX = e.clientX - offsetRef.current.x;
		const rawY = e.clientY - offsetRef.current.y;

		let newX = Math.min(Math.max(rawX, 0), containerWidth - boxWidth);
		let newY = Math.min(Math.max(rawY, 0), containerHeight - boxHeight);

		const navbarRect = getNavbarRect();
		if (navbarRect) {
			const nextBoxRight = newX + boxWidth;

			const overlapsNavbar = newX < navbarRect.right && nextBoxRight > navbarRect.left && newY < navbarRect.bottom;

            console.log(newX)
            console.log(nextBoxRight)

            if (overlapsNavbar && newX < navbarRect.left) {
                newX = navbarRect.left - boxWidth - 1;
            }
            else if (overlapsNavbar && nextBoxRight > navbarRect.right) {
                newX = navbarRect.right + 1;
            }
            else {
                newY = navbarRect.bottom + 1;
            }

		}

		setPosition({ x: newX, y: newY });
	};

	const handleMouseUp = () => {
		draggingRef.current = false;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	};

	return (
		<div
			ref={boxRef}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				position: 'absolute',
				cursor: draggingRef.current ? 'grabbing' : 'grab',
				userSelect: 'none'
			}}
			onMouseDown={handleMouseDown}
		>
			{children}
		</div>
	);
};

export default Draggable;
