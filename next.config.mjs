/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/blank", destination: "/", permanent: true },
      { source: "/fullscreen-page", destination: "/", permanent: true },
      { source: "/contact", destination: "/contact-8", permanent: true },
      { source: "/portfolio", destination: "/s-projects-basic", permanent: true },
      { source: "/about", destination: "/", permanent: false },
      {
        source: "/copy-of-ineffable-qualite-2019",
        destination: "/copy-of-ineffable-qualit%C3%A8-2019",
        permanent: true,
      },
      {
        source: "/movies-ineffable-qualite",
        destination: "/movies-ineffable-qualit%C3%A8",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
