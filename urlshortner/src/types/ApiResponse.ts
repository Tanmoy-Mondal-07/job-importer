import { URI } from "./URLResponse";

export interface ApiResponse {
    success: boolean;
    message: string;
    urldetails?: URI;
    urllist?: Array<URI>
}