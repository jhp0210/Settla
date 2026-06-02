import { HeroSection } from "./components/HeroSection";
import { PropertyListings } from "./components/PropertyListings";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section className="border-t border-gray-200 bg-[#F8F7F4] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <PropertyListings theme="light" />
        </div>
      </section>
    </main>
  );
}
