export default function getDomain() {

    const baseUrl = process.env.NEXT_VERCEL_URL
        ? `https://${process.env.NEXT_VERCEL_URL}`
        : "http://localhost:3000/";

    return baseUrl
}