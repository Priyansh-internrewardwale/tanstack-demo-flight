"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "/api/flights";

export const useFlights = () => {
  const queryClient = useQueryClient();

  // GET
  const { data: flights, isLoading, error } = useQuery({
    queryKey: ["flights"],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch flights");
      return res.json();
    },
  });

  // PUT
  const bookTicket = useMutation({
    mutationFn: async ({ flightId, tickets }: { flightId: string; tickets: number }) => {
      const res = await fetch("/api/flights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightId, tickets }),
      });
  
      if (!res.ok) throw new Error("Failed to book ticket");
  
      return res.json();
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["flights"] }); 
    },
    onError: () => {
      alert("Error booking tickets. Please try again.");
    },
  });

  return { flights, isLoading, error, bookTicket };
};
