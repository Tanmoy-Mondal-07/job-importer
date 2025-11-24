const conf = {
    appwriteUrl: String(process.env.NEXT_APPWRITE_ENDPOINT),
    appwriteProjectid: String(process.env.NEXT_APPWRITE_PROJECT_ID),
    appwriteDatabaseid: String(process.env.NEXT_APPWRITE_DATABASE_ID),

    appwriteCollectionid: String(process.env.NEXT_APPWRITE_URI_COLLECTION_ID)
}

export default conf;