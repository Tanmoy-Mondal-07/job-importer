import appwriteURLService from '@/appwrite/uriConfig'
import { URI } from '@/types/URLResponse';
import getDomain from '@/util/domainName';

export async function GET(request: Request, context: { params: { code: string } }) {

    try {
        const domain = getDomain()
        const { code } = await context.params;
        // console.log(code);

        if (!code) {
            return Response.json({
                success: false,
                message: "invalid query param"
            }, { status: 402 })
        }

        const urlData = await appwriteURLService.geturlDetails(code)
        console.log(urlData);

        if (urlData.total == 0) {
            return Response.json({
                success: false,
                message: "no such uri found"
            }, { status: 404 })
        }

        const { $id, redirectUrl, shortUrl, clickCount } = urlData.documents[0]
        const urldetails: URI = { urlId: $id, redirectUrl, shortUrl: domain + shortUrl, clickCount }

        return Response.json({
            success: true,
            message: "here the uri details",
            urldetails
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "internal server error"
        }, { status: 500 })
    }
}

export async function DELETE(request: Request, context: { params: { code: string } }) {

    try {

        const { code } = await context.params;
        // console.log(code);

        if (!code) {
            return Response.json({
                success: false,
                message: "invalid query param"
            }, { status: 402 })
        }

        const urlData = await appwriteURLService.geturlDetails(code)
        console.log(urlData);

        if (!urlData.documents[0]) {
            return Response.json({
                success: false,
                message: "no such uri found"
            }, { status: 404 })
        }

        const { $id } = urlData.documents[0]
        await appwriteURLService.deleteurl($id)

        return Response.json({
            success: true,
            message: "URL has been deleted",
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "internal server error"
        }, { status: 500 })
    }
}