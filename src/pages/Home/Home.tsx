import { HomeBackground } from "./sections/HomeBackground";
import { HomeHero } from "./sections/HomeHero";
import { HomeFeatures } from "./sections/HomeFeatures";
import { HomeTransactions } from "./sections/HomeTransactions";
import { HomeAnalytics } from "./sections/HomeAnalytics";
import { HomeFooter } from "./sections/HomeFooter";

export const Home = () => (
  <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
    <HomeBackground />
    <HomeHero />
    <HomeFeatures />
    <HomeTransactions />
    <HomeAnalytics />
    <HomeFooter />
  </main>
);

export default Home;
