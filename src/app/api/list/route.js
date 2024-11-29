import { NextResponse as Response } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/option.js";
import connectDB from "@/db/db"; // Assuming you have a connectDB utility
import List from "@/models/saveList.model"; 
import mongoose from "mongoose";


async function handler(req, id) {
    await connectDB();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user) {
            return Response.json({ success: false, message: 'User not found' }, { status: 400 });
        }
        const userId = new mongoose.Types.ObjectId(user._id)
        console.log(userId);
        if (req.method === "POST") {
            const { name, data } = await req.json();
             console.log(name, data);
            if (!name || !data) {
                return Response.json({ error: "Please fill all fields" }, { status: 400 });
            }
            try {
                const list = await List.create({ name, data:data, user:userId });
                return Response.json({ success: true, data: list }, { status: 200 });
            } catch (error) {
                console.error("Error saving list:", error);
                return Response.json({ error: error.message }, { status: 500 });
            }
        } 
        if (req.method === "GET") {
            const lists = await List.find({ user:userId });
            console.log(lists);
           
            return Response.json({ success: true, data: lists }, { status: 200 });
        }
        if (req.method === "DELETE") {
          const id = id.params.id 
          console.log(id);
          if (!id) {
            return Response.json({ error: "Please provide the list ID" }, { status: 400 });
          }
          try {
            const list = await List.findOneAndDelete({ _id: id, user: userId }); // Ensure user ownership
            if (!list) {
              return Response.json({ error: "List not found or unauthorized" }, { status: 404 });
            }
            return Response.json({ success: true, data: list }, { status: 200 });
          } catch (error) {
            console.error("Error deleting list:", error);
            return Response.json({ error: error.message }, { status: 500 });
          }
        } 
        else {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

    } catch (error) {
        console.error("Error saving list:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export { handler as GET, handler as POST, handler as DELETE };