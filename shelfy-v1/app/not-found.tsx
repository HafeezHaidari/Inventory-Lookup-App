export const dynamic = 'force-dynamic'; // skip static prerender for 404

export default function NotFound() {
    return (
        <main className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
            <p className="text-gray-600">Sorry, we couldn’t find that page.</p>
        </main>
    );
}
