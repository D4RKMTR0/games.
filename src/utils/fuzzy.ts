export function fuzzyMatch(query: string, title: string, tolerance: number = 0): boolean {
    const normalizedQuery = query.toLowerCase()
    const normalizedTitle = title.toLowerCase()
    let matchedCount = 0

    for (let i = 0; i < normalizedTitle.length; i++) {
        if (normalizedTitle[i] === normalizedQuery[matchedCount]) {
            matchedCount++
        }
        if (matchedCount === normalizedQuery.length) return true
    }

    const unmatchedCount = normalizedQuery.length - matchedCount
    return unmatchedCount <= tolerance
}