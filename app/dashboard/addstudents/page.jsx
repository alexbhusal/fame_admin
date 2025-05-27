"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../../utils/firebase";
import Swal from "sweetalert2";
import UploadImage from "@/Components/Main/UploadImage";

const AddUserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    imgurl: "",
    VisaCountry: "",
    University: "",
    VisaGrantDate: "",
    createdAt: new Date().toLocaleString(),
  });
  const [submitting, setSubmitting] = useState(false);

  const defaultImg =
    "https://res.cloudinary.com/dxdbrqanq/image/upload/v1745248025/cmwzp0fvevkvc4ypxmpc.png";

  const handleChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission reload
    if (!user.imgurl || user.imgurl === defaultImg) {
    Swal.fire("Error", "Please upload a profile image before submitting.", "error");
    return;
  }
    setSubmitting(true);
    try {
      const userData = {
        ...user,
        imgurl: user.imgurl || defaultImg,
      };
      await addDoc(collection(firestore, "student"), userData);
      Swal.fire("Success", `${user.fullName} added successfully!`, "success");
      router.push("/dashboard/students");
    } catch (error) {
      console.error("Add user error:", error);
      Swal.fire("Error", "Failed to add user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const setImageUrl = (url) => {
    setUser((prev) => ({ ...prev, imgurl: url }));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Student</h1>

      <div className="flex justify-center items-center mb-4">
        <img
          src={user.imgurl || defaultImg}
          alt="User"
          className="h-32 w-32 object-cover rounded-2xl"
        />
      </div>

      <div className="flex justify-center mb-6">
        <UploadImage setImageUrl={setImageUrl} />
      </div>

      <form onSubmit={handleSubmit}>
        {["fullName", "email", "VisaCountry", "Feedback", "VisaGrantDate"].map((field) => {
          let inputType = "text";
          if (field === "email") inputType = "email";
          if (field === "VisaGrantDate") inputType = "date";

          return (
            <div key={field} className="mb-4">
              <label className="block mb-1 font-serif">{field.toUpperCase()}</label>
              <input
                type={inputType}
                name={field}
                value={user[field]}
                required
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="w-full border px-3 py-2 rounded font"
              />
            </div>
          );
        })}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {submitting ? "Submitting..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
