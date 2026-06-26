import { Helmet } from "react-helmet-async";

const SITE = "Nepal Trip";
const BASE_DESC =
  "Nepal Trip — Best Tour and Travel Agency in Gorakhpur. Nepal Holiday Tours, Honeymoon Packages, Pilgrimage Tours, Char Dham, Kailash Mansarovar, Kashmir, Kathmandu, Pokhara, Muktinath,नेपाल Trip is a trusted tour and travel agency in Gorakhpur offering Nepal tour packages, Kailash Mansarovar Yatra, Muktinath, Kathmandu, Pokhara, Kashmir, Ayodhya, Varanasi, Char Dham, honeymoon packages and customized holiday tours at affordable prices.";

export default function SEO({ title, description, path = "/", image }) {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — Best Tour and Travel Agency in Gorakhpur`;
  const desc = description || BASE_DESC;
  const url = `https://nepaltrip.vercel.app${path}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta name="author" content="Nepal Trip" />
      <meta
name="robots"
content="index, follow, max-image-preview:large"
/>
      <meta
name="viewport"
content="width=device-width, initial-scale=1"
/>
      <meta httpEquiv="content-language" content="en-IN" />
      <meta name="geo.region" content="IN-UP" />
<meta name="geo.placename" content="Gorakhpur" />
<meta name="geo.position" content="26.7606;83.3732" />
<meta name="ICBM" content="26.7606,83.3732" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
      <meta
name="keywords"
content="
Nepal Tour Package,
Nepal Trip,
Tour Operator Gorakhpur,
Nepal Holiday Package,
Kathmandu Tour,
Pokhara Tour,
Muktinath Tour,
Kailash Mansarovar Yatra,
Kailash Package,
Nepal Tour from Gorakhpur,
Best Travel Agency,
Char Dham Yatra,
Ayodhya Tour,
Varanasi Tour,
Honeymoon Package Nepal"
/>
      <script type="application/ld+json">
{JSON.stringify({
"@context":"https://schema.org",
"@type":"TravelAgency",
"name":"Nepal Trip",
"url":"https://nepaltrip.vercel.app",
"logo":"https://nepaltrip.in/logo.png",
"description":"Nepal Tour Packages, Kailash Mansarovar, Honeymoon, Pilgrimage Tours.",
"telephone":"+919580261255",
"address":{
"@type":"PostalAddress",
"addressLocality":"Sumer sagar near RR palace hotel ,Gorakhpur",
"addressRegion":"Uttar Pradesh",
"addressCountry":"IN"
}
})}
</script>
    </Helmet>
  );
}
