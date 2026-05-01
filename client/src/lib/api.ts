const API_URL = import.meta.env.VITE_API_URL

export const api = {
    get: (path: string) => fetch(`${API_URL}${path}`, {
        credentials: "include",
    }).then(res => res.json()),

    post: (path: string, body: unknown) => fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    }).then(res => res.json()),

    patch: (path: string, body: unknown) => fetch(`${API_URL}${path}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    }).then(res => res.json()),

    delete: (path: string) => fetch(`${API_URL}${path}`, {
        method: "DELETE",
        credentials: "include",
    }).then(res => res.json()),
}