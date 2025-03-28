/*
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic"; 

const fetchAirlines = async (search: string) => {
  const response = await fetch("https://freetestapi.com/api/v1/airlines", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch airlines");
  }

  const airlines = await response.json();

  
  if (search) {
    return airlines.filter((airline: any) =>
      airline.destinations.some(
        (dest: any) =>
          dest.name.toLowerCase().includes(search.toLowerCase()) ||
          dest.code.toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  return airlines;
};

export default async function AirlinesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams?.search || "";
  const airlines = await fetchAirlines(searchQuery);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Airlines List</h1>

      <form className="mb-6 flex gap-2">
        <input
          type="text"
          name="search"
          placeholder="Search by destination or airport code..."
          defaultValue={searchQuery}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
        {searchQuery && (
          <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded">
            Home
          </Link>
        )}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {airlines.length > 0 ? (
          airlines.map((airline: any) => (
            <div
              key={airline.id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold">
                {airline.name} ({airline.code})
              </h2>
              <p className="text-gray-600">Country: {airline.country}</p>
              <p>
                Website:{" "}
                <a
                  href={airline.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {airline.website}
                </a>
              </p>
              <h3 className="font-medium mt-2">Destinations:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {airline.destinations.map((destination: any) => (
                  <li key={destination.code}>
                    {destination.name} ({destination.code})
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No airlines found for this destination.
          </p>
        )}
      </div>
    </div>
  );
}
*/

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const fetchUsers = async () => {
  const res = await fetch("/api/users");
  return res.json();
};

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const handleLogin = () => {
    const user = users?.find(
      (u: any) =>
        u.username === loginData.username && u.password === loginData.password
    );
    if (user) {
      router.push("/flights");
    } else {
      alert("Invalid credentials");
    }
  };

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Login
        </h2>
        <input
          type="text"
          placeholder="Username"
          value={loginData.username}
          onChange={(e) =>
            setLoginData({ ...loginData, username: e.target.value })
          }
          className="w-full p-3 border rounded-md mb-3 focus:ring focus:ring-blue-300 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          className="w-full p-3 border rounded-md mb-3 focus:ring focus:ring-blue-300 outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/add-user")}
          className="w-full mt-3 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
        >
          Add User
        </button>
      </motion.div>
    </div>
  );
}
