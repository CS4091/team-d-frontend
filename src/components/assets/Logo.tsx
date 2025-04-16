import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 300"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            fill="white" // Set the default color to white
            {...props}
        >
            <path
                d="M138.751 61.38q0 .247 75.687 22.681s31.852-35.936 42.651-25.64-25.886 42.405-25.886 42.405l19.794 74.129-10.746 8.33-37.893-53.86-26.626 23.42 4.628 23.714-7.543 6.921-16.223-26.943q-27.211-15.279-27.211-15.525t8.438-7.537l24.105 5.564 23.914-26.38-56.904-41.58q9.815-9.946 9.815-9.699z"
                strokeWidth={0.6}
                strokeLinejoin="round"
            />
            <path
                transform="matrix(.62654 0 0 .62653 70.96 86.343)"
                d="M50 12.66L59.21 41 89 41 64.9 58.51 74.1 86.85 50 69.33 25.9 86.85 35.1 58.51 11 41 40.79 41 50 12.66z"
            />
            <path
                d="M147.837 168.409c2.83-2.326 4.483-.145 2.823 1.935 0-1.947-58.546 63.94-94.687 59.104s-10.29-52.218-10.29-52.218c.005-.004-14.048 33.366 9.341 42.664s92.813-51.485 92.813-51.485z"
                transform="translate(-1.595 -2.968)"
                strokeWidth={0.6}
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Logo;