import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/legacy/", "/api/"],
    },
    sitemap: "https://shamiltp.life/sitemap.xml",
  };
}
