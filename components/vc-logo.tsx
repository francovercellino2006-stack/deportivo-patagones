import Image from "next/image";
import { cn } from "@/lib/utils";

export function VCShield({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/escudo.png"
      alt="Escudo Villa Congreso"
      width={size}
      height={Math.round(size * 206 / 212)}
      className={className}
    />
  );
}

export function VCLogoCircle({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/escudo.png"
      alt="Villa Congreso"
      width={size}
      height={Math.round(size * 206 / 212)}
      className={cn("rounded-2xl", className)}
    />
  );
}
