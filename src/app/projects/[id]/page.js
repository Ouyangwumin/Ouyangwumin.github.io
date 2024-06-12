import React from "react";
import { fs, promises } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiArrowLeftSLine } from "@remixicon/react";

async function getMdxFilesList(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const files = await promises.readdir(fullPath);
  const mdxFilesList = await Promise.all(
    files
      .filter((file) => path.extname(file) === ".mdx")
      .map(async (file) => {
        const filePath = path.join(fullPath, file);
        const fileContents = await promises.readFile(filePath, "utf8");
        const { data } = matter(fileContents);
        return {
          filePath,
          projectName: data.projectName,
          projectDesription: data.projectDescription,
          projectTime: data.projectTime,
          projectImg: data.projectImg,
          projectId: data.projectName.toLowerCase().replace(/\s/g, ""),
        };
      })
  );
  return mdxFilesList.reverse();
}
const projectList = await getMdxFilesList("src/data/projects");

export async function generateStaticParams() {
  return projectList.map((project) => ({
    id: projectList.projectId,
  }));
}

export default async function Page({ params }) {
  const project = projectList.find(
    (project) => project.projectId === params.id
  );
  const fileContents = await promises.readFile(project.filePath, "utf8");
  const { content } = matter(fileContents);

  const MDXComponents = useMDXComponents();

  return (
    <main className="md:w-[40rem] w-full m-auto px-8 mt-32 flex flex-col gap-10">
      <div className="flex gap-4">
        <Link href="/projects">
          <Button variant="outline" size="icon">
            <RiArrowLeftSLine className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold">{project.projectName}</h1>
      </div>
      <MDXRemote source={content} components={MDXComponents} />
    </main>
  );
}
