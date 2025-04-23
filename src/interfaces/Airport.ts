export interface Runway {
    name: string;
    length: number;
    width: number;
    lighted: boolean;
  }
  
export interface Airport {
    name: string;
    city: string;
    type: string;
    id: string;
    iata: string;
    fuel: number;
    lat: number;
    lng: number;
    runways: Runway[];
  }