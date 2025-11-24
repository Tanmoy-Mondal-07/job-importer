import appwriteURLService from '@/appwrite/uriConfig'
import { URI } from '@/types/URLResponse';
import getDomain from '@/util/domainName'

export async function POST(request: Request) {

    try {
        const domain = getDomain()
        const { redirectUrl } = await request.json()

        const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

        if (!urlRegex.test(redirectUrl)) {
            return Response.json({
                success: false,
                message: "Invalid URL"
            }, { status: 400 }
            );
        }

        const res = await appwriteURLService.createURL({ redirectUrl })
        const cleaned: URI = {
            redirectUrl: res.redirectUrl,
            shortUrl: domain + res.shortUrl,
            clickCount: res.clickCount,
            urlId: res.$id
        }

        return Response.json({
            success: true,
            message: "Short url has been created",
            urldetails: cleaned
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "internal Server error"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const result = await appwriteURLService.getAllurl();

        if (!result) {
            return Response.json({
                success: false,
                message: "No URLs found"
            }, { status: 404 });
        }

        const cleanedList: URI[] = result.documents.map(doc => ({
            redirectUrl: doc.redirectUrl,
            shortUrl: doc.shortUrl,
            clickCount: doc.clickCount,
            urlId: doc.$id
        }));

        return Response.json({
            success: true,
            message: "last 25 urls",
            urllist: cleanedList
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "internal Server error"
        }, { status: 500 })
    }
}