'use client'
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast.js"
import Image from "next/image";
import {useRouter} from 'next/navigation'
import Link from "next/link";


export default function Search() {
  const [code, setCode] = useState("");
  const [image, setImage] = useState(null);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter()

  // Handle search for the status code
  const handleSearch = () => {
    if (!code) return;
    const imageUrl = `https://http.dog/${code}.jpg`; // http.dog URL
    setImage({ code, url: imageUrl });
  };

  // Handle save list
  const handleSave = async () => {
    if (!session) {
      toast({
        title: "You need to sign in to save the list.",
        variant: "destructive",
      });
      return;
      }
    
    try {
     const response =  await axios.post("/api/list", {
        name: `List for ${code}`,
        data: [{ code, imageUrl: image.url }]
      });
      console.log(response);
      if( response.status === 200){
        toast({
          title: "List saved successfully.",
          variant: "default",
        });

      }
    } catch (error) {
      console.error("Error saving list:", error);
      toast({
        title: "Error saving list.",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Search HTTP Status Codes</h1>
      
      {/* Search Input Section */}
      <div className="flex justify-between items-center mb-6">
      <div className="flex">
        <input
          type="text"
          placeholder="Enter status code (e.g., 200)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="p-2 w-64 border border-black-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
        >
          Search
        </button>
        </div>
        <div className="lex justify-end mt-1">
      <Link className="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 " href="/saveList">
        
          Saved List
        
      </Link>
    </div>
      </div>

      {/* Image Display Section */}
      {image && (
        <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-4">Status Code: {image.code}</h3>
          <Image
            src={image.url}
            alt={`HTTP ${image.code}`}
            width={500}
            height={500}
            className="w-full rounded-md"
          />
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
