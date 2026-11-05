import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/myProjectDetails/mycontributions.html",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/myprojects.html",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/myProjectDetails/oopspilot.html",
        destination: "/projects/opspilot",
        permanent: true,
      },
      {
        source: "/myProjectDetails/regretmap.html",
        destination: "/projects/regretmap",
        permanent: true,
      },
      {
        source: "/myProjectDetails/rewind.html",
        destination: "/projects/rewind",
        permanent: true,
      },
      {
        source: "/myProjectDetails/lume.html",
        destination: "/projects/lume",
        permanent: true,
      },
      {
        source: "/myProjectDetails/njin.html",
        destination: "/projects/njin",
        permanent: true,
      },
      {
        source: "/myProjectDetails/blogify.html",
        destination: "/projects/blogify",
        permanent: true,
      },
      {
        source: "/myProjectDetails/osmium.html",
        destination: "/projects/osmium",
        permanent: true,
      },
      {
        source: "/myProjectDetails/skylark.html",
        destination: "/projects/skylark",
        permanent: true,
      },
      {
        source: "/myProjectDetails/coffeecat.html",
        destination: "/projects/coffeecat",
        permanent: true,
      },
      {
        source: "/myProjectDetails/blog-rendering-lib.html",
        destination: "/projects/brl",
        permanent: true,
      },
      {
        source: "/myProjectDetails/tutora.html",
        destination: "/projects/tutora",
        permanent: true,
      },
      {
        source: "/myProjectDetails/emvbazar.html",
        destination: "/projects/emvbazar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
