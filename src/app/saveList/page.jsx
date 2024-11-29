"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function SaveList() {
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]); // Filtered data state
  const [filter, setFilter] = useState(""); // Status code filter input
  const { data: session } = useSession();

  // Fetch lists when the component mounts
  useEffect(() => {
    if (session) {
      fetchLists();
    }
  }, [session]);

  // Function to fetch saved lists
  const fetchLists = async () => {
    try {
      const response = await axios.get("/api/list"); // Correct API endpoint
      if (response.data.success) {
        setLists(response.data.data);
        setFilteredLists(response.data.data); // Initialize filtered lists
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  // Function to filter lists based on status code
  const handleFilter = (e) => {
    const searchTerm = e.target.value;
    setFilter(searchTerm);

    if (!searchTerm) {
      setFilteredLists(lists); // Reset to all lists if filter is empty
    } else {
      const filtered = lists.filter((list) =>
        list.data.some((item) => item.code.startsWith(searchTerm))
      );
      setFilteredLists(filtered);
    }
  };

  // Function to delete a list
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete-list/${id}`); // API endpoint for deletion
      setLists(lists.filter((list) => list._id !== id)); // Update state after deletion
      setFilteredLists(filteredLists.filter((list) => list._id !== id)); // Update filtered list
      alert("List deleted successfully!");
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete the list.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        {/* Button to go to search page */}
        <Link href="/search">
          <button className="bg-blue-500 text-white py-2 text-center px-4 rounded-md hover:bg-blue-600">
            Go to Search
          </button>
        </Link>
      </div>
    <h1 className="text-3xl font-bold text-center mb-6">Saved Lists</h1>

      {/* Filter Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          placeholder="Filter by status code (e.g., 2xx, 404)"
          className="p-2 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredLists.length === 0 ? (
        <p className="text-center text-gray-600">No matching lists found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredLists.map((list) => (
            <div
              key={list._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
            >
              <h3 className="text-lg font-medium mb-2">{list.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Created at: {new Date(list.createdAt).toLocaleDateString()}
              </p>

              <div className="space-y-4">
                {list.data.map((item) => (
                  <div key={item._id} className="flex flex-col items-center">
                    <h4 className="text-md font-medium">
                      Status Code: {item.code}
                    </h4>
                    <Image
                      src={item.imageUrl}
                      alt={`HTTP ${item.code}`}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-md"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleDelete(list._id)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md w-full hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
