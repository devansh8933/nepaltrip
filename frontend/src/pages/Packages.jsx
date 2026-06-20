import PackagesSection from "@/components/sections/PackagesSection";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";

export default function Packages() {
  return (
    <div data-testid="packages-page">
      <SEO
        title="Tour Packages — Nepal, Kashmir, Char Dham, Ayodhya & more"
        description="Curated Nepal Tour Packages from Gorakhpur, Kathmandu Pokhara Tour Package, Muktinath Tour Package, Char Dham Yatra Package, Kailash Mansarovar Yatra, Kashmir & Honeymoon Packages."
        path="/packages"
      />
      <PageHeader
        overline="Tour Packages"
        title="Pick a destination, pick a theme."
        subtitle="Hand-built itineraries across Kathmandu, Pokhara, Chitwan, Kashmir, Char Dham, Ayodhya and beyond."
      />
      <PackagesSection full />
    </div>
  );
}
