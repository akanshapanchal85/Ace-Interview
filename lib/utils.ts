import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { interviewCovers } from "@/constants";
import { mappings } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const techIconBaseURL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
const normalizeTechName = (tech: string) => {
  const key = tech
    .toLowerCase()
    .replace(/\.js$/, "")
    .replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings] ?? key;
}


export type TechLogo = { tech: string; url: string };

export const getTechLogo = async (techArray: string[]): Promise<TechLogo[]> => {
  const logoURLS = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  return logoURLS;
};
export function getRandomInterviewCover() {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
}
