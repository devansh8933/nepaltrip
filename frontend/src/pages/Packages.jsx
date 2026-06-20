import PackagesSection from "@/components/sections/PackagesSection";
import PageHeader from "@/components/PageHeader";

export default function Packages() {
  return (
    <div data-testid="packages-page">
      <PageHeader
        overline="Tour Packages"
        title="Pick a destination, pick a theme."
        subtitle="Hand-built itineraries across Kathmandu, Pokhara, Chitwan, Kashmir, Char Dham, Ayodhya and beyond."
      />
      <PackagesSection full />
    </div>
  );
}
