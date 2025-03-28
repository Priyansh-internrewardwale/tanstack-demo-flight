"use client";
import { useState } from "react";
import { useFlights } from "@/hooks/useFlights";

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

export default function Flights() {
  const { flights, isLoading, error, bookTicket } = useFlights();

  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Destination | null>(
    null
  );
  const [ticketCount, setTicketCount] = useState(1); // Default 1 ticket

  if (isLoading) return <p>Loading flights...</p>;
  if (error) return <p>Error loading flights.</p>;

  const openModal = (flight: Destination) => {
    setSelectedFlight(flight);
    setTicketCount(1); // Reset ticket count
    setShowModal(true);
  };

  const handleBookTickets = () => {
    if (selectedFlight && ticketCount > 0) {
      bookTicket.mutate({
        flightId: selectedFlight.flightId,
        tickets: ticketCount,
      });
      setShowModal(false); // Close modal after booking
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Flight Information</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {flights.map((airline: Airline) => (
          <div key={airline.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">
              {airline.name} ({airline.code})
            </h2>
            <h3 className="mt-2 font-semibold">Destinations:</h3>
            <ul className="ml-4 list-disc">
              {airline.destinations.map((dest: Destination) => (
                <li
                  key={dest.flightId}
                  className="flex justify-between items-center"
                >
                  <span>
                    {dest.name} ({dest.code}) - Available Tickets:{" "}
                    {dest.availableTickets}
                  </span>
                  <button
                    className={`ml-2 px-3 py-1 rounded ${
                      dest.availableTickets > 0
                        ? "bg-blue-500 text-white"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    disabled={dest.availableTickets === 0}
                    onClick={() => openModal(dest)}
                  >
                    {dest.availableTickets > 0 ? "Book Ticket" : "Sold Out"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
            <p>
              <strong>Airline:</strong> {selectedFlight.name}
            </p>
            <p>
              <strong>Flight ID:</strong> {selectedFlight.flightId}
            </p>
            <p>
              <strong>Destination:</strong> {selectedFlight.name} (
              {selectedFlight.code})
            </p>
            <p>
              <strong>Available Tickets:</strong>{" "}
              {selectedFlight.availableTickets}
            </p>

            <label className="block mt-4">
              <span className="font-semibold">Enter Tickets:</span>
              <input
                type="number"
                min="1"
                max={selectedFlight.availableTickets}
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="border p-2 rounded w-full mt-1"
              />
            </label>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleBookTickets}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
