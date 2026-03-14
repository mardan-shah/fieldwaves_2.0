"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  interactive?: boolean;
}

export default function GridBackground({
  className,
  interactive = true,
}: GridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !gridRef.current) return;

      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current || !gridRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update spotlight position
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);

        // Calculate subtle parallax for the grid lines
        const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
        gridRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <>
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none md:hidden"
        style={{
          backgroundImage:
            "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        ref={containerRef}
        className={cn(
          "absolute invisible md:visible inset-0 overflow-hidden pointer-events-none z-0",
          className,
        )}
        style={{
          WebkitMaskImage:
            "radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
          maskImage:
            "radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
        }}
      >
        <div
          ref={gridRef}
          className="absolute -inset-[50px] opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "center center",
          }}
        />
      </div>
    </>
  );
}
