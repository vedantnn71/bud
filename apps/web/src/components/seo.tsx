export default function DefaultSeo() {
  const opts = {
    title:
      "Beacon – fast, simple and privacy friendly analytics that you will love using.",
    description:
      "Beacon is a fast, simple and privacy friendly analytics tool that you will love using.",
    socialImg:
      "https://github.com/vedantnn71/beacon/raw/main/apps/web/public/social.png",
    url: "https://github.com/vedantnn71/beacon",
    favicon: "/favicon.ico",
    handle: "@usebud",
  };

  return (
    <>
      <title>{opts.title}</title>
      <meta name="description" content={opts.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href={opts.favicon} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={opts.handle} />
      <meta name="twitter:creator" content={opts.handle} />
      <meta name="twitter:title" content={opts.title} />
      <meta name="twitter:description" content={opts.description} />
      <meta name="twitter:image" content={opts.socialImg} />

      <meta property="og:url" content={opts.url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={opts.title} />
      <meta property="og:description" content={opts.description} />
      <meta property="og:image" content={opts.socialImg} />
    </>
  );
}
