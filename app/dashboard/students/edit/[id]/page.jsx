
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../../../../utils/firebase";
import Swal from "sweetalert2";
import Load from "@/Components/Animation/Load";

const EditUserPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const defaultImg =
    "https://res.cloudinary.com/dxdbrqanq/image/upload/v1745248025/cmwzp0fvevkvc4ypxmpc.png";


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(firestore, "student", id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUser({ id, ...userSnap.data() });
        else Swal.fire("Not Found", "User not found", "error");
      } catch {
        console.log("Error", "Failed to fetch user data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateDoc(doc(firestore, "student", id), user);
      Swal.fire("Success", `${user.fullName} updated!`, "success");
      router.push("/dashboard/students");
    } catch {
      console.log("Error", "Failed to update user", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `Delete ${user.fullName}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(firestore, "student", id));
        Swal.fire("Deleted!", `${user.fullName} has been deleted.`, "success");
        router.push("/dashboard/members");
      } catch {
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Load/></div>;
  if (!user) return <div className="flex justify-center items-center h-screen">User Not Found</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center ">Edit Student</h1>
      <div className="flex justify-center items-center">
      <img src={user.imgurl || defaultImg} alt=""  className="h-32 w-32 object-cover rounded-2xl"/>
    </div>
        {["fullName", "email", "VisaCountry", "University", "VisaGrantDate"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block mb-1 font-serif">{field.toUpperCase()}</label>
          <input
            type="text"
            name={field}
            value={user[field] || ""}
            placeholder={`${field} not available`}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded font"
          />
        </div>
      ))}
      <div className="flex gap-4 mt-6">
        <button onClick={handleUpdate} disabled={updating} className="bg-black text-white px-6 py-2 rounded">
          {updating ? "Updating..." : "Update"}
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded">Delete</button>
      </div>
    </div>
  );
};

export default EditUserPage;
