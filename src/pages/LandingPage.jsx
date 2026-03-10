/**
 * 역할: 랜딩페이지 메인 레이아웃
 * 주요 기능: Navbar + 각 섹션 컴포넌트 조합
 * 의존성: Navbar, HeroSection, FeaturesSection, SpecsSection, PricingSection, CtaSection, ModalProvider
 */
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import SpecsSection from "../components/SpecsSection";
import PricingSection from "../components/PricingSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";
import SubscribeModal from "../components/SubscribeModal";
import { ModalProvider } from "../context/ModalContext";

export default function LandingPage() {
  return (
    <ModalProvider>
      <div className="overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          {/* <SpecsSection /> */}
          <PricingSection />
          {/* <CtaSection /> */}
        </main>
        <Footer />
        <SubscribeModal />
      </div>
    </ModalProvider>
  );
}
