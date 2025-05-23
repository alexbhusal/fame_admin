"use client";
import Load from "@/Components/Animation/Load";
import React from "react";

const page = () => {
  return (
    <>
      <div>
        <h1 className="text-center text-xl md:text-5xl font-serif">Admin Dashboard</h1>
        <div className="h-screen w-full flex justify-center items-center">
          <Load />
        </div>
      </div>
    </>
  );
};

export default page;
