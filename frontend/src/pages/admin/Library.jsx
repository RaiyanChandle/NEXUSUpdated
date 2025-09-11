import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminLibrary = () => {

  const API_URL=import.meta.env.VITE_API_URL;
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/library/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data.books || []);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pdf", file);
      await axios.post(`${API_URL}/admin/library/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setFile(null);
      setSuccess("Book uploaded!");
      fetchBooks();
    } catch (err) {
      setError("Failed to upload book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto mt-10">
      <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-8 w-full">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setFile(e.target.files[0])}
          className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Book"}
        </button>
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        {success && <div className="text-green-400 text-center mt-2">{success}</div>}
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-violet-900/80 text-white text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Title</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">PDF</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Uploaded By</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td className="px-4 sm:px-6 py-3">{book.title}</td>
                <td className="px-4 sm:px-6 py-3">
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-violet-300 hover:text-violet-400"
                  >
                    View/Download
                  </a>
                </td>
                <td className="px-4 sm:px-6 py-3">{book.uploadedBy?.email || "-"}</td>
                <td className="px-4 sm:px-6 py-3">{new Date(book.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 sm:px-6 py-6 text-center text-violet-300">
                  No books uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLibrary;
