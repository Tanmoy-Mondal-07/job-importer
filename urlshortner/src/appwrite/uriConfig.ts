import { URI } from '@/types/URLResponse.js';
import conf from '../conf/conf.js';
import { Client, ID, Databases, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectid);
        this.databases = new Databases(this.client);
    }

    async createURL({ redirectUrl }: { redirectUrl: string }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseid,
                conf.appwriteCollectionid,
                ID.unique(),
                {
                    redirectUrl,
                    shortUrl: ID.unique(),
                    clickCount: 0
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createURL :: error", error);
            throw error;
        }
    }

    async updateClickCount(urlId: string, { redirectUrl, shortUrl, clickCount, }: URI) {
        try {
            if (urlId || redirectUrl || shortUrl || clickCount) {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseid,
                    conf.appwriteCollectionid,
                    urlId,
                    {
                        redirectUrl,
                        shortUrl,
                        clickCount,
                    }
                )
            } else throw new Error("Meesing Fild")
        } catch (error) {
            console.log("Appwrite serive :: updateClickCount :: error", error);
            throw error;
        }
    }

    async geturlDetails(shortUrl: string) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteCollectionid,
                [
                    Query.equal("shortUrl", shortUrl)
                ]
            )
        } catch (error) {
            console.log("Appwrite service :: geturlDetails :: error", error);
            throw error;
        }
    }

    async deleteurl(postId: string) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseid,
                conf.appwriteCollectionid,
                postId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteurl :: error", error);
            throw error
        }
    }

    async getAllurl() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteCollectionid,
            )
        } catch (error) {
            console.log("Appwrite serive :: getAllurl :: error", error);
            throw error;
        }
    }
}


const service = new Service()
export default service