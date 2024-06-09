import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";

function getMdxFilesList(directoryPath) {
  const fullPath = path.join(process.cwd(), directoryPath);
  const files = fs.readdirSync(fullPath);
  const mdxFilesList = files
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => {
      const filePath = path.join(fullPath, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      return {
        filePath,
        projectName: data.projectName,
        projectDesription: data.projectDescription,
        projectTime: data.projectTime,
        projectImg: data.projectImg,
        projectId: data.projectName.toLowerCase().replace(/\s/g, ""),
      };
    });
  return mdxFilesList;
}

const projectList = getMdxFilesList("src/data/projects");
// console.log(projectList);

export async function generateStaticParams() {
  return projectList.map((project) => ({
    id: projectList.projectId,
  }));
}

export default async function Page({ params }) {
  const project = projectList.find(
    (project) => project.projectId === params.id
  );

  const fileContents = fs.readFileSync(project.filePath, "utf8");
  const { content } = matter(fileContents);

  const MDXComponents = useMDXComponents();

  return (
    <main className="md:w-[40rem] w-full m-auto px-8 mt-32 flex flex-col gap-10">
      <h1 className="text-3xl font-semibold">{project.projectName}</h1>
      <MDXRemote source={content} components={MDXComponents} />
    </main>
  );
}
