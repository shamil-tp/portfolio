import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Architecture Case Studies | Shamil TP",
  description:
    "Explore 12 production-grade backend systems, real-time streaming pipelines, AI agents, and open-source software built by Shamil TP (OpsPilot, RegretMap, Rewind, Tutora, emvBazar).",
  alternates: {
    canonical: "https://shamiltp.life/projects",
  },
  openGraph: {
    title: "Projects & Architecture Case Studies | Shamil TP",
    description:
      "Explore 12 production-grade backend systems, real-time streaming pipelines, AI agents, and open-source software built by Shamil TP.",
    url: "https://shamiltp.life/projects",
    images: ["/assets/og/projects.png"],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
