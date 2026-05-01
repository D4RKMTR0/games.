import { useEffect } from "react"
import { authClient } from "../lib/auth-client"

export function useTheme() {
    const { data: session } = authClient.useSession()
    const user = session?.user as any

    useEffect(() => {
        const theme = user?.theme ?? "dark"
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
    }, [user?.theme])
}