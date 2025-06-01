import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
await client.connect()
const db = client.db(process.env.MONGODB_DB)

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  database: mongodbAdapter(db)
})
