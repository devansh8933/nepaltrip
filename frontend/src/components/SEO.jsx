import { Helmet } from "react-helmet-async";

const SITE = "Nepal Trip";
const BASE_DESC =
  "Nepal Trip — Best Tour and Travel Agency in Gorakhpur. Nepal Holiday Tours, Honeymoon Packages, Pilgrimage Tours, Char Dham, Kailash Mansarovar, Kashmir, Kathmandu, Pokhara, Muktinath.";

export default function SEO({ title, description, path = "/", image }) {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — Best Tour and Travel Agency in Gorakhpur`;
  const desc = description || BASE_DESC;
  const url = `https://nepaltrip.in${path}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
