import dbConnect from "@/lib/dbConnect";
import ImportLogModel from "@/models/ImportLog";
import JobModel from "@/models/Job";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export async function POST(request: Request) {
    await dbConnect();

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

        const LogExist = await ImportLogModel.findOne({ timestamp: channel.lastBuildDate })
        // console.log(channel.lastBuildDate);
        if (!LogExist) {
            let newJobs: number = 0;
            let updatedJobs: number = 0;
            let failedJobs: string[] = []
            for (const item of channel.item) {
                try {
                    const exists = await JobModel.findOne({ externalId: item.id });

                    if (exists) {
                        updatedJobs += 1
                    } else {
                        newJobs += 1
                    }

                    const newJob = new JobModel({
                        externalId: item.id,
                        title: item.title,
                        company: item.company,
                        location: item.location,
                        description: item.description,
                        type: item.job_type,
                        url: item.link,
                        postedAt: item.pubDate
                    });
                    await newJob.save();
                } catch (error: any) {
                    // failedJobs.push(error.message)
                    // console.log(error.message);
                }
            }
            const newLog = new ImportLogModel({
                source: channel.link[0]["@_href"],
                timestamp: channel.lastBuildDate,
                totalFetched: channel.item.length,
                newJobs,
                updatedJobs,
                failedJobs
            })
            await newLog.save()
        }


        return Response.json(
            {
                success: true,
                timestamp: channel.lastBuildDate,
                data: channel,
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
