export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-800 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Book Review API</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">API Documentation</h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-2">Authentication Endpoints</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">POST /api/auth/signup</code> - Register a new user
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">POST /api/auth/login</code> - Authenticate and return
                  a token
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">GET /api/auth/profile</code> - Get current user
                  profile
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Book Endpoints</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">POST /api/books</code> - Add a new book
                  (Authenticated users only)
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">GET /api/books</code> - Get all books (with
                  pagination and optional filters)
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">GET /api/books/:id</code> - Get book details by ID
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">PUT /api/books/:id</code> - Update a book
                  (Authenticated users only)
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">DELETE /api/books/:id</code> - Delete a book
                  (Authenticated users only)
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Review Endpoints</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">POST /api/books/:bookId/reviews</code> - Submit a
                  review (Authenticated users only)
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">GET /api/reviews/user</code> - Get all reviews by the
                  current user (Authenticated users only)
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">PUT /api/reviews/:id</code> - Update your own review
                  (Authenticated users only)
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">DELETE /api/reviews/:id</code> - Delete your own
                  review (Authenticated users only)
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Search Endpoint</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">GET /api/search?q=query</code> - Search books by
                  title or author
                </li>
              </ul>
            </section>

            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                This is a simple frontend for the Book Review API. For detailed documentation and setup instructions,
                please refer to the README.md file.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>Book Review API - Node.js with Express</p>
        </div>
      </footer>
    </div>
  )
}
