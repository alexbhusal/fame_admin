"use client";
import React, { useEffect, useState } from "react";
import { getDocs, firestore, collection } from "../../../utils/firebase";
import * as XLSX from "xlsx";
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
    "https://res.cloudinary.com/dxdbrqanq/image/upload/v1745248025/cmwzp0fvevkvc4ypxmpc.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDB = collection(firestore, "admin");
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((user, i) => ({
        "S No.": i + 1,
        Name: user.fullName,
        Designation:user.Designation,
        Email: user.email,
        Phone: user.mobileNumber,
        Cretedat:user.createdAt
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admin");
    XLSX.writeFile(workbook, "Admin_Data.xlsx");
  };

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers
    .sort((a, b) => a.fullName?.localeCompare(b.fullName))
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
        Admin Record
      </h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-2 py-1 rounded w-full md:w-1/3"
        />
        <button
          onClick={exportToExcel}
          className="bg-black text-white py-1 px-4 rounded self-end md:self-auto"
        >
          Download Excel
        </button>
      </div>

      <div className="flex justify-between items-center text-lg font-semibold mb-2">
        <div>
          Showing {filteredUsers.length} result
          {filteredUsers.length !== 1 && "s"}
        </div>
        <div>
          <Link
            href="/dashboard/addmembers"
            className="text-base bg-black text-white p-2 rounded-xl"
          >
            +Add Member
          </Link>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-xs md:text-2xl">
            {["S No.", "Name","Designation", "Email", "Phone", "Profile", "Action"].map(
              (h, i) => (
                <th key={i} className="border px-2 py-1">
                  {h}
                </th>
              )
            )}
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
              <td className="border px-2 py-1">{user.fullName}</td>
              <td className="border px-2 py-1">{user.designation}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">
                {user.mobileNumber || "----"}
              </td>
              <td className="border px-2 py-1 w-32">
                <img
                  src={user.imgurl || defaultImg}
                  alt=""
                  className="h-10 w-auto md:w-24 md:h-24 object-cover rounded-2xl"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() =>
                    router.push(`/dashboard/members/edit/${user.id}`)
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
