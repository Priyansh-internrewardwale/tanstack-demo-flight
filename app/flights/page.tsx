"use client";
import { useState, useEffect } from "react";
import { useFlights } from "@/hooks/useFlights";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<{
    airline: Airline;
    destination: Destination;
  } | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFlights, setFilteredFlights] = useState<Airline[]>([]);

  useEffect(() => {
    if (flights && Array.isArray(flights)) {
      setFilteredFlights(flights);
    }
  }, [flights]);

  if (isLoading)
    return (
      <p className="text-gray-400 text-center mt-10">Loading flights...</p>
    );
  if (error)
    return (
      <p className="text-red-500 text-center mt-10">
        {error instanceof Error ? error.message : "An error occurred"}
      </p>
    );

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredFlights(flights || []);
      return;
    }

    const filtered = (flights || [])
      .map((airline: Airline) => ({
        ...airline,
        destinations: airline.destinations.filter(
          (dest: Destination) =>
            dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.code.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((airline: Airline) => airline.destinations.length > 0);

    setFilteredFlights(filtered);
  };

  const openModal = (airline: Airline, destination: Destination) => {
    setSelectedFlight({ airline, destination });
    setTicketCount(1);
    setShowModal(true);
  };

  const handleBookTickets = () => {
    if (selectedFlight && ticketCount > 0) {
      bookTicket.mutate({
        flightId: selectedFlight.destination.flightId,
        tickets: ticketCount,
      });

      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-5">
      {/* top bar */}
      <div className="flex justify-between items-center mb-6 bg-black">
        <h1 className="text-3xl font-bold bg-black">Flight Information</h1>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-4 bg-red-600 hover:bg-red-700 transition duration-300 rounded-lg shadow"
        >
          Log Out
        </button>
      </div>

      {/* search bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by destination or airport code..."
          className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 transition duration-300 rounded-lg shadow"
        >
          Search
        </button>
      </div>

      {/* flight list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 bg-black">
        {filteredFlights.length > 0 ? (
          filteredFlights.map((airline: Airline) => (
            <div
              key={airline.id}
              className="p-5 bg-gray-800 border border-gray-600 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold">
                {airline.name} ({airline.code})
              </h2>
              <h3 className="mt-2 font-semibold">Destinations:</h3>
              <ul className="mt-2 space-y-2">
                {airline.destinations.map((dest: Destination) => (
                  <li
                    key={dest.flightId}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {dest.name} ({dest.code}) - {dest.availableTickets}{" "}
                      Tickets
                    </span>
                    <button
                      className={`px-3 py-1 rounded-lg transition duration-300 ${
                        dest.availableTickets > 0
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-500 cursor-not-allowed"
                      }`}
                      disabled={dest.availableTickets === 0}
                      onClick={() => openModal(airline, dest)}
                    >
                      {dest.availableTickets > 0 ? "Book" : "Sold Out"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No flights found for "{searchQuery}".
          </p>
        )}
      </div>

      {/* modal */}
      <AnimatePresence>
        {showModal && selectedFlight && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
              <p>
                <strong>Airline:</strong> {selectedFlight.airline.name}
              </p>
              <p>
                <strong>Destination:</strong> {selectedFlight.destination.name}{" "}
                ({selectedFlight.destination.code})
              </p>
              <p>
                <strong>Available Tickets:</strong>{" "}
                {selectedFlight.destination.availableTickets}
              </p>

              <label className="block mt-4">
                <span className="font-semibold">Enter Tickets:</span>
                <input
                  type="number"
                  min="1"
                  max={selectedFlight.destination.availableTickets}
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="border p-2 rounded w-full mt-1 bg-gray-900 text-white"
                />
              </label>

              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
