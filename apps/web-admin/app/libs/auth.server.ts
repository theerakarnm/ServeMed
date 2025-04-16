import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: {
    provider: "postgres", //change this to your database provider
    url: process.env.DATABASE_URL, // path to your database or connection string
  }
})
