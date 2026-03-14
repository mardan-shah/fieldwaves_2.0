import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  setIsOpen?: (open: boolean) => void;
}
const Logo = ({ setIsOpen }: LogoProps) => {
  return (
    <div className="pointer-events-auto shrink-0">
      <Link href="/" onClick={setIsOpen ? () => setIsOpen(false) : undefined} className="group">
        <div className="flex items-stretch  transition-transform duration-300 group-hover:scale-105">
          <div className="border-primary bg-black/40 border px-3 py-1 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src="/Logo1.svg"
              alt="FieldWaves Logo"
              width={30}
              height={30}
            />
          </div>
          <div className="border border-primary border-l-0 px-3 py-1 flex items-center bg-black/40">
            <span className="font-mono font-bold text-[12px] text-primary tracking-[0.3em]">
              FIELDWAVES
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
