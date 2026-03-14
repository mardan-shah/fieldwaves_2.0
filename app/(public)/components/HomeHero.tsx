import Button from "@/components/ui/button";
import Container from "@/components/ui/Container";
import GridBackground from "@/components/ui/GridBackground";

const HomeHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
      
      <GridBackground />

      <div className="relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6  w-full">
        <div className="flex flex-col items-start gap-4">
          <Container
            variant="secondary"
            className="px-3 py-1 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-primary animate-pulse rounded-full" />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
              SYSTM_READY // BUILD_V2.5.0
            </span>
          </Container>

          <h1 className="font-display text-4xl text-[2.5rem] sm:text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter uppercase mb-6 max-w-5xl">
            Engineered <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px var(--primary)" }}
            >
              Aesthetics
            </span>{" "}
            <br />
            Infrastructure
          </h1>

          <div className="max-w-2xl !bg-background/50 backdrop-blur-sm border-l-4 border-primary pl-6 py-4">
            <div className="skew-x-0">
              <p className="text-lg sm:text-xl md:text-2xl text-secondary font-light leading-relaxed">
                We build{" "}
                <span className="text-white font-bold">
                  unique digital identities
                </span>{" "}
                with
                <span className="text-white font-bold">
                  {" "}
                  enterprise-grade rigor
                </span>
                . High-performance infrastructure for ambitious startups and
                global industry leaders.
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-12 flex gap-6 flex-wrap ">
            <Button href="/projects">EXPLORE WORK</Button>
            <Button variant="outline" href="/services">
              LEARN MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
