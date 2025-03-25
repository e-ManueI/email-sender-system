"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/`,
        formData
      );
      alert("File uploaded successfully!");
    } catch {
      alert("Error uploading file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-12">
      <h1>Upload Excel File Format (name, email)</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-6"
      >
        <input
          type="file"
          className="p-12 border border-gray-300 rounded-lg border-dashed flex items-center justify-center"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
