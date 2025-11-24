import appwriteURLService from '@/appwrite/uriConfig'
import { URI } from '@/types/URLResponse';

export async function GET(request: Request, context: { params: { id: string } }) {

    try {

        const id = context.params.id;
        // console.log(code);

        if (!id) {
            return Response.json({
                success: false,
                message: "invalid query param"
            }, { status: 402 })
        }

        const urlData = await appwriteURLService.geturlDetails(id)
        console.log(urlData);

        if (!urlData.documents[0]) {
            return Response.json({
                success: false,
                message: "no such uri found"
            }, { status: 404 })
        }

        const { $id } = urlData.documents[0]
        const cleaned: URI = {
            redirectUrl: urlData.documents[0].redirectUrl,
            shortUrl: urlData.documents[0].shortUrl,
            clickCount: urlData.documents[0].clickCount + 1,
        }

        await appwriteURLService.updateClickCount($id, cleaned)

        return Response.json({
            success: true,
            message: "click count has been added",
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "internal server error"
        }, { status: 500 })
    }
}