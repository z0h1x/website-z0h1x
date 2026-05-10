import { useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { SocialLinks } from "@/components/SocialLinks";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      <div
        className={`min-h-screen relative overflow-hidden transition-all duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ transitionTimingFunction: 'var(--ease-emphasized)' }}
      >
        <ParticlesBackground />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-5 py-12">
          <div className="w-full max-w-md">
            <ProfileCard />
            <SocialLinks />

            <footer
              className="text-center mt-10 text-muted-foreground text-xs animate-fade-up"
              style={{ animationDelay: '0.9s' }}
            >
              <p>{t("footer.madeWith", { year: new Date().getFullYear() })}</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
