import { Airport } from "@/interfaces/Airport";
import api from "@/lib/axiosConfig";
import { Resizable } from "re-resizable";

interface Props {
    selectedOrganization: string;
    routeList: Airport[][];
}

const Controls = ({selectedOrganization, routeList}: Props) => {
    const calculateRoute = () => {
        console.log(routeList.map(pair => pair.map(airport => airport.id)))
        api.post('/aviation/route', {
            organizationId: selectedOrganization,
            demand: routeList.map(pair => pair.map(airport => airport.id))
        })
        .then((resp) => {
            console.log(resp.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

	return (

		<div className='fixed bottom-4 right-4 border-[1px] border-white/25 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:rounded-2xl z-[48] p-6 flex flex-col gap-4'>

			<button
				className='bg-pink py-3 px-12 rounded-xl text-white font-bold hover:bg-pinkhover'
			
			>
				Past Routes
			</button>
			<button
				className='bg-pink py-3 px-12 rounded-xl text-white font-bold enabled:hover:bg-pinkhover disabled:opacity-50'
                onClick={calculateRoute}
                disabled={routeList.length === 0}
			>
				Calculate Route
			</button>

		</div>

	);
};

export default Controls;
