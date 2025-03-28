"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const addUser = async (newUser: { username: string; password: string }) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) {
    throw new Error("Failed to add user");
  }
  return res.json();
};

export default function AddUser() {
  const router = useRouter();
  const [userData, setUserData] = useState({ username: "", password: "" });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User added successfully!");
      router.push("/"); // Redirect to login page after success
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Add User
        </h2>
        <input
          type="text"
          placeholder="Username"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          className="w-full p-3 border rounded-md mb-3 focus:ring focus:ring-blue-300 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          className="w-full p-3 border rounded-md mb-3 focus:ring focus:ring-blue-300 outline-none"
        />
        <button
          onClick={() => mutation.mutate(userData)}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Add User
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-3 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
