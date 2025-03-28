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

// Function to fetch data from the API if file is empty
const fetchFlightsData = async () => {
  const response = await fetch("https://freetestapi.com/api/v1/airlines");
  const data = await response.json();

  // Add flightId and availableTickets to each destination
  const flights = data.map((airline: any) => ({
    ...airline,
    destinations: airline.destinations.map((dest: any, index: number) => ({
      ...dest,
      flightId: `${airline.code}-${index + 1}`,
      availableTickets: Math.floor(Math.random() * 11), // Random 0-10
    })),
  }));

  // Write the modified data to flights.json
  await fs.writeFile(filePath, JSON.stringify(flights, null, 2));
  return flights;
};

// Function to read flights.json
const readFlights = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Function to write to flights.json
const writeFlights = async (data: any) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// GET - Fetch flights from local file or API if empty
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
  
    let flights = await readFlights();
  
    // If there's a search query, filter on the backend
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

// PUT - Update available tickets when a user books
export async function PUT(req: Request) {
  try {
    const { flightId, tickets } = await req.json(); // Get number of tickets to book
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
