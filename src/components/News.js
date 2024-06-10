import React from "react";
import NewsMd from "@/data/News.mdx";

export default function News() {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-3xl font-semibold">News</h1>
      <NewsMd />
    </section>
  );
}