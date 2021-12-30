module.exports = {
  reactStrictMode: true,

  i18n: {
    locales: ["fa-IR"],
    defaultLocale: "fa-IR",
    domains: [
      {
        domain: "touskaweb.com",
        defaultLocale: "fa-IR",
        // an optional http field can also be used to test
        // locale domains locally with http instead of https
        http: true,
      },
    ],
  },

  images: {
    domains: ["api.tooskaweb.com", "touskaweb.com"],
  },
};
