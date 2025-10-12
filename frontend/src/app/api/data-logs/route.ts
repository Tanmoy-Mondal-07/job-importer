import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const db = mongoose.connection.db;
        if (!db) {
            return Response.json(
                {
                    success: false,
                    message: "DB connection error",
                }, { status: 500 }
            );
        }

        const collection = db.collection("importlogs");
        const data = await collection.find({}).sort({ _id: -1 }).toArray();

        if (!data) {
            return Response.json(
                {
                    success: false,
                    message: "no data recived from DB",
                }, { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                data
            }, { status: 200 }
        );

    } catch (error: any) {
        console.error("Failed to fetch API:", error.message);

        return Response.json(
            {
                success: false,
                message: error.message,
            }, { status: 500 }
        );
    }
}
