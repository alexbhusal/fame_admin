"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../../../utils/firebase";
import Swal from "sweetalert2";
import UploadImage from "@/Components/Main/UploadImage";

const AddUserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    countryName: "",
    description: "",
    picUrl: "",
    createdAt: new Date().toLocaleString(),
  });
  const [submitting, setSubmitting] = useState(false);

  const defaultImg =
  "https://images.pexels.com/photos/1098515/pexels-photo-1098515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

  const handleChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission reload
    if (!user.picUrl || user.picUrl === defaultImg) {
    Swal.fire("Error", "Please upload a profile image before submitting.", "error");
    return;
  }
    setSubmitting(true);
    try {
      const userData = {
        ...user,
        picUrl: user.picUrl || defaultImg,
      };
      await addDoc(collection(firestore, "country"), userData);
      Swal.fire("Success", `${user.countryName} added successfully!`, "success");
      router.push("/dashboard/country");
    } catch (error) {
      console.error("Add user error:", error);
      Swal.fire("Error", "Failed to add user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const setImageUrl = (url) => {
    setUser((prev) => ({ ...prev, picUrl: url }));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Student</h1>

      <div className="flex justify-center items-center mb-4">
        <img
          src={user.picUrl || defaultImg}
          alt="User"
          className="h-32 w-32 object-cover rounded-2xl"
        />
      </div>

      <div className="flex justify-center mb-6">
        <UploadImage setImageUrl={setImageUrl} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
  <label className="block mb-1 font-serif">COUNTRY NAME</label>
  <input
    type="text"
    name="countryName"
    value={user.countryName || ""}
    placeholder="enter country name "
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded font"
  />
</div>

<div className="mb-4">
  <label className="block mb-1 font-serif">DESCRIPTION</label>
  <textarea
    name="description"
    value={user.description || ""}
    placeholder="enter description "
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded font"
    rows={4}
  />
</div>


        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {submitting ? "Adding..." : "Add Country"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
