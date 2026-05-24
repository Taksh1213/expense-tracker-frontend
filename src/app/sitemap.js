const siteUrl = "https://expense-tracker-taksh.vercel.app";

export default function sitemap() {
  const routes = ["", "/login", "/register"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
