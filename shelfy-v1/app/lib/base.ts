export function getApiBase() {
    return (
        process.env.API_BASE ||
        process.env.NEXT_PUBLIC_API_BASE ||
        'https://api.inventory-index.com' // final fallback
    );
}