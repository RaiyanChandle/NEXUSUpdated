
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentLibrary = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_URL}/student/library/books`);
        setBooks(res.data.books);
      } catch {
        setError("Failed to load books");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
    // eslint-disable-next-line
  }, [API_URL]);

  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">Library</h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search books by title..."
          className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white flex-1"
        />
      </div>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="bg-violet-900/60 rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-[500px] w-full text-white text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left min-w-[120px]">Title</th>
              <th className="px-4 py-2 text-left min-w-[120px]">Uploaded By</th>
              <th className="px-4 py-2 text-left min-w-[80px]">Date</th>
              <th className="px-4 py-2 text-left min-w-[60px]">PDF</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-violet-300">Loading...</td></tr>
            ) : filteredBooks.map(book => (
              <tr key={book.id} className="border-b border-violet-700 last:border-0">
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.uploadedBy?.email || "-"}</td>
                <td className="px-4 py-2">{new Date(book.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <a href={book.url} target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">View PDF</a>
                </td>
              </tr>
            ))}
            {!loading && filteredBooks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-violet-300">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentLibrary;
