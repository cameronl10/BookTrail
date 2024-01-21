import { ServerApiVersion } from "mongodb";

export const uri = () => `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ws7bnps.mongodb.net/?retryWrites=true&w=majority`;

export const mongo_client_config = { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } }