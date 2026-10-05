/** @type {import('next').NextConfig} */
const legacyProjectRedirects = [
  ["stray-blade", "stray-blade"],
  ["games-moongaze", "moongaze"],
  ["games-neural-investigation", "neural-investigations"],
  ["feel-the-sound", "feel-the-sound"],
  ["sound-art-unstable-matter", "unstable-matter"],
  ["collabs-art", "berlin-winter"],
  ["sound-art-wasch-collective", "wasch-collective"],
  ["sound-art-the-veil", "the-veil"],
  ["copy-of-ineffable-qualitè-2019", "betahaus-ads"],
  ["movies-anedonia", "anedonia"],
  ["movies-petricore", "petricore"],
  ["from-now-on", "from-now-on"],
  ["movies-per-non-sparire-lentamente", "per-non-sparire-lentamente"],
  ["movies-balena-spiaggiata", "la-storia-della-balena-spiaggiata"],
  ["movies-ori", "ori-and-the-will-of-the-wisps"],
  ["movies-escape", "escape"],
  ["movies-ineffable-qualitè", "ineffable-qualite"],
].flatMap(([legacy, slug]) => {
  const encodedLegacy = encodeURI(legacy);
  const entries = [
    {
      source: `/${legacy}`,
      destination: `/works/${slug}`,
      statusCode: 308,
    },
  ];
  if (encodedLegacy !== legacy) {
    entries.push({
      source: `/${encodedLegacy}`,
      destination: `/works/${slug}`,
      statusCode: 308,
    });
  }
  return entries;
});

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
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
        destination: "/works/betahaus-ads",
        statusCode: 308,
      },
      {
        source: "/movies-ineffable-qualite",
        destination: "/works/ineffable-qualite",
        statusCode: 308,
      },
      ...legacyProjectRedirects,
    ];
  },
};

export default nextConfig;
