import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "flights.json");

type Destination = {
  name: string;
  code: string;
  flightId: string;
  availableTickets: number;
};

type Airline = {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: string;
  fleet_size: string;
  headquarters: string;
  website: string;
  destinations: Destination[];
};

const fetchFlightsData = async () => {
  const response = await fetch("https://freetestapi.com/api/v1/airlines");
  const data = await response.json();

  const flights = data.map((airline: any) => ({
    ...airline,
    destinations: airline.destinations.map((dest: any, index: number) => ({
      ...dest,
      flightId: `${airline.code}-${index + 1}`,
      availableTickets: Math.floor(Math.random() * 11),
    })),
  }));

  await fs.writeFile(filePath, JSON.stringify(flights, null, 2));
  return flights;
};

const readFlights = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeFlights = async (data: any) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
  
    let flights = await readFlights();
  
    if (query) {
      flights = flights.map((airline: Airline) => ({
        ...airline,
        destinations: airline.destinations.filter(
          (dest: Destination) =>
            dest.name.toLowerCase().includes(query) || dest.code.toLowerCase().includes(query)
        ),
      })).filter((airline: Airline) => airline.destinations.length > 0);
    }
  
    return NextResponse.json(flights, { status: 200 });
  }

export async function PUT(req: Request) {
  try {
    const { flightId, tickets } = await req.json(); 
    let flights = await readFlights();

    let ticketBooked = false;

    flights = flights.map((airline: any) => ({
      ...airline,
      destinations: airline.destinations.map((dest: any) => {
        if (dest.flightId === flightId && dest.availableTickets >= tickets) {
          ticketBooked = true;
          return { ...dest, availableTickets: dest.availableTickets - tickets };
        }
        return dest;
      }),
    }));

    if (!ticketBooked) {
      return NextResponse.json(
        { message: "Not enough tickets available" },
        { status: 400 }
      );
    }

    await writeFlights(flights);
    return NextResponse.json(
      { message: "Tickets booked successfully!", data: flights },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating flights", error: (error as Error).message },
      { status: 500 }
    );
  }
}
