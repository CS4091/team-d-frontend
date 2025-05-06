export interface GeneratedRoute {
	baseline: {
		routing: {
			[routeId: string]: string[];
		};
		stats: {
			fuel: number;
			times: {
				[routeId: string]: number;
			};
			time: number;
		};
	};
	optimized: {
		routing: {
			[routeId: string]: string[];
		};
		stats: {
			fuel: number;
			times: {
				[routeId: string]: number;
			};
			time: number;
		};
	};
}