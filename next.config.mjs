/** @type {import('next').NextConfig} */
const projectRedirects = [
  "stray-blade",
  "games-moongaze",
  "games-neural-investigation",
  "feel-the-sound",
  "sound-art-unstable-matter",
  "collabs-art",
  "sound-art-wasch-collective",
  "sound-art-the-veil",
  "copy-of-ineffable-qualitè-2019",
  "movies-anedonia",
  "movies-petricore",
  "from-now-on",
  "movies-per-non-sparire-lentamente",
  "movies-balena-spiaggiata",
  "movies-ori",
  "movies-escape",
  "movies-ineffable-qualitè",
].flatMap((slug) => {
  const encoded = encodeURI(slug);
  const entries = [
    {
      source: `/${slug}`,
      destination: `/works/${encoded}`,
      statusCode: 308,
    },
  ];
  if (encoded !== slug) {
    entries.push({
      source: `/${encoded}`,
      destination: `/works/${encoded}`,
      statusCode: 308,
    });
  }
  return entries;
});

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/blank", destination: "/", statusCode: 308 },
      { source: "/fullscreen-page", destination: "/", statusCode: 308 },
      { source: "/contact", destination: "/about", statusCode: 308 },
      { source: "/contact-8", destination: "/about", statusCode: 308 },
      { source: "/portfolio", destination: "/works", statusCode: 308 },
      { source: "/s-projects-basic", destination: "/works", statusCode: 308 },
      { source: "/games", destination: "/works", statusCode: 308 },
      { source: "/sound-art", destination: "/works", statusCode: 308 },
      { source: "/movies", destination: "/works", statusCode: 308 },
      { source: "/music", destination: "/works", statusCode: 308 },
      {
        source: "/copy-of-ineffable-qualite-2019",
        destination: "/works/copy-of-ineffable-qualit%C3%A8-2019",
        statusCode: 308,
      },
      {
        source: "/movies-ineffable-qualite",
        destination: "/works/movies-ineffable-qualit%C3%A8",
        statusCode: 308,
      },
      ...projectRedirects,
    ];
  },
};

export default nextConfig;
