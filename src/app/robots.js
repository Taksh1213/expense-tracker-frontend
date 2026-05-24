const siteUrl = "https://expense-tracker-taksh.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/dashboard",
          "/expenses",
          "/add-transaction",
          "/analytics",
          "/profile",
          "/settings",
          "/delete-account",
          "/logout",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
