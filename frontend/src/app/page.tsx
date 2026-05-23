"use client";

import Hero from "@/components/Hero";
import WhatIsLindblad from "@/components/WhatIsLindblad";
import NoiseChannels from "@/components/NoiseChannels";
import DrivenTLS from "@/components/DrivenTLS";
import SteadyState from "@/components/SteadyState";
import Simulation from "@/components/Simulation";
import References from "@/components/References";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhatIsLindblad />
      <NoiseChannels />
      <DrivenTLS />
      <SteadyState />
      <Simulation />
      <References />
      <Footer />
    </main>
  );
}
