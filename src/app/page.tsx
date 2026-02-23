import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import SuccessStories from "@/components/SuccessStories";
import Partners from "@/components/Partners";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-dark overflow-x-hidden">
      <Header />
      <Hero />
      <Services />
      <SuccessStories />
      <Partners />
      <CTA />
      <Footer />
    </main>
  );
}
