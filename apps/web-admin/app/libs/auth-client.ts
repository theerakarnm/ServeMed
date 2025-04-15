import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { adminClient, usernameClient, organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: window.ENV?.PUBLIC_AUTH_API_URL || window.ENV.env?.PUBLIC_AUTH_API_URL,
  basePath: "/api/auth",
  plugins: [
    usernameClient()
  ]
})
