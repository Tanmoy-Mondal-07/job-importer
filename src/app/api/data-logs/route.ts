import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export async function POST(request: Request) {
    // await dbConnect();

    try {
        const apiResponse = await axios.get(process.env.JOBLIST_API_URI!, {
            responseType: "text",
        });

        const parser = new XMLParser({
            ignoreAttributes: false,
            removeNSPrefix: true,
        });

        const jsonData = parser.parse(apiResponse.data);
        // console.log(JSON.stringify(jsonData, null, 2));

        const channel = jsonData?.rss?.channel;
        // console.log("title:", channel?.title);
        if (channel?.title == "Error") {
            return Response.json(
                {
                    success: false,
                    message: channel?.description || "Bad Request",
                },
                { status: 404 }
            );
        }

        if (!channel.item) {
            return Response.json(
                {
                    success: false,
                    message: channel?.description || "API Error",
                },
                { status: 404 }
            );
        }

        

        return Response.json(
            {
                success: true,
                timestamp: channel.lastBuildDate,
                data: channel.item,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Failed to fetch API:", error.message);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch API",
            },
            { status: 500 }
        );
    }
}
