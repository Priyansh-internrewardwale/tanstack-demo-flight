"use client";
import { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tickets: number) => void;
  flight: {
    airline: string;
    destination: string;
    flightId: string;
    airportCode: string;
    website: string;
    availableTickets: number;
  } | null;
};

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  flight,
}: ModalProps) {
  const [ticketCount, setTicketCount] = useState(1);

  if (!isOpen || !flight) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold">
          Book Ticket for {flight.airline}
        </h2>
        <p className="text-gray-600 mt-2">
          Destination:{" "}
          <strong>
            {flight.destination} ({flight.airportCode})
          </strong>
        </p>
        <p className="text-gray-600">
          Flight ID: <strong>{flight.flightId}</strong>
        </p>
        <p className="text-gray-600">
          Website:{" "}
          <a href={flight.website} target="_blank" className="text-blue-500">
            {flight.website}
          </a>
        </p>
        <p className="text-gray-600">
          Available Tickets: <strong>{flight.availableTickets}</strong>
        </p>

        <div className="mt-4">
          <label className="block font-semibold">Number of Tickets:</label>
          <input
            type="number"
            value={ticketCount}
            min="1"
            max={flight.availableTickets}
            onChange={(e) =>
              setTicketCount(
                Math.min(
                  flight.availableTickets,
                  Math.max(1, Number(e.target.value))
                )
              )
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onConfirm(ticketCount)}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
