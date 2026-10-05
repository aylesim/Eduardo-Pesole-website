import site from "@/content/site.json";

export function getSite() {
  return site;
}

export function getProjects() {
  return site.projects;
}

export function getProjectBySlug(slug) {
  const decoded = decodeURIComponent(slug);
  return site.projects.find(
    (p) => p.slug === slug || p.slug === decoded || encodeURI(p.slug) === slug
  );
}

export function getPortfolio() {
  return site.portfolio;
}

export function getNav() {
  return site.global.nav;
}

export function getProjectCategory(slug) {
  for (const group of site.portfolio) {
    for (const item of group.items) {
      if (item.slug === slug || item.slug === decodeURIComponent(slug)) {
        return group.category;
      }
    }
  }
  return null;
}

export function getHubLinks(hubKey) {
  const portfolio = site.portfolio;
  if (hubKey === "games") {
    return portfolio.find((g) => g.category === "Games")?.items ?? [];
  }
  if (hubKey === "sound-art") {
    return portfolio.find((g) => g.category === "Art Collabs")?.items ?? [];
  }
  if (hubKey === "movies") {
    return portfolio.find((g) => g.category === "Movies")?.items ?? [];
  }
  if (hubKey === "music") {
    return portfolio.find((g) => g.category === "Music")?.items ?? [];
  }
  return [];
}

export function getSecondary(hubKey) {
  return site.secondary[hubKey];
}
