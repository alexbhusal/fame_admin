"use client";
import React, { useEffect, useState } from "react";
import { getDocs, firestore, collection } from "../../../utils/firebase";
import { useRouter } from "next/navigation";
import Loadusers from "@/Components/Animation/LoadUsers";
import Link from "next/link";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const router = useRouter();

  const defaultImg =
  "https://images.pexels.com/photos/1098515/pexels-photo-1098515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDB = collection(firestore, "country");
        const sData = await getDocs(userDB);
        const userData = sData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filteredUsers = users.filter((user) =>
    user.countryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers
    .sort((a, b) => a.countryName?.localeCompare(b.countryName))
    .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const uniqueValues = (key) =>
    [...new Set(users.map((u) => u[key]).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    );

  return loading ? (
    <Loadusers />
  ) : (
    <div className="px-4">
      <h1 className="text-center text-2xl md:text-4xl italic font-serif mb-4">
        Country Record
      </h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Country Name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-2 py-1 rounded w-full md:w-1/3"
        />
      </div>

      <div className="flex justify-between items-center text-lg font-semibold mb-2">
        <div>
          Showing {filteredUsers.length} result
          {filteredUsers.length !== 1 && "s"}
        </div>
        <div>
          <Link
            href="/dashboard/country/addcountry"
            className="text-base bg-black text-white p-2 rounded-xl"
          >
            +Add Country
          </Link>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-xs md:text-2xl">
            {[
              "S No.",
              "Country Name",
              "Description",
              "Picture",
              "Action",
            ].map((h, i) => (
              <th key={i} className="border px-2 py-1">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, i) => (
            <tr
              key={user.id}
              className="text-center text-xs md:text-xl font-mono italic"
            >
              <td className="border px-2 py-1">
                {(currentPage - 1) * usersPerPage + i + 1}
              </td>
              <td className="border px-2 py-1  overflow-x-scroll">{user.countryName}</td>
              <td className="border px-2 py-1  max-w-96  text-justify text-sm">
                {user.description || "No description available"}
              </td>
              <td className="border px-2 py-1 w-48">
                <img
                  src={user.picUrl || defaultImg}
                  alt=""
                  className="h-10 w-auto md:w-48 md:h-auto object-cover rounded-2xl"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() =>
                    router.push(`/dashboard/country/edit/${user.id}`)
                  }
                  className="bg-black text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
