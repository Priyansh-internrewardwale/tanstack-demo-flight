export interface Destination {
    name: string;
    code: string;
  }
  
  export interface Airline {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: string;
    fleet_size: string;
    headquarters: string;
    website: string;
    destinations: Destination[];
  }
  