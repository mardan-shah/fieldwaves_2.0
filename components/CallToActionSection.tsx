import { Lightbulb } from "lucide-react";
import Button from "./ui/button";

const CallToActionSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Lightbulb className="mx-auto text-primary mb-8" size={48} />
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">
          Ready to Transform?
        </h2>
        <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
          Let's engineer your next breakthrough. Whether it's scaling
          infrastructure, enhancing security, or launching a new product, we're
          ready to help.
        </p>
        <Button href="/contact">INITIATE PROJECT</Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
