export async function GET(request:Request) {
    return Response.json({
            ok: true,
            version:"1.0"
        }, { status: 200 })
}