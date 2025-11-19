import { LandingAbout } from "@/components/ui/landing-about";
import { LandingContact } from "@/components/ui/landing-contact";
import { LandingFooter } from "@/components/ui/landing-footer";
import { LandingGallery3D } from "@/components/ui/landing-gallery-3d";
import { LandingHeader } from "@/components/ui/landing-header";
import { LandingHero } from "@/components/ui/landing-hero";
import { LandingMap } from "@/components/ui/landing-map";
import { LandingServices } from "@/components/ui/landing-services";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-white">
      <LandingHeader />

      <section id="inicio" className="relative px-4 pt-24 sm:px-6">
        <LandingHero />
      </section>

      <div className="relative z-10 bg-transparent">
        <LandingAbout />
        <LandingServices />
        <LandingGallery3D />
        <LandingMap />
        <LandingContact />
        <LandingFooter />
      </div>
    </main>
  );
}
