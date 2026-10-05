import Link from "next/link";

type Props = {
  className?: string;
};

export default function HomeNote({ className }: Props) {
  return (
    <div className={className}>
      <p className="max-w-[24ch] font-mono text-[0.625rem] leading-relaxed tracking-[0.12em] text-[#151417]/70 uppercase">
        Sound designer and composer, Berlin
      </p>
      <Link
        href="/about#showreel"
        className="pointer-events-auto mt-2 inline-flex font-mono text-[0.625rem] tracking-[0.12em] text-[#151417] uppercase underline decoration-1 underline-offset-4"
      >
        Showreel
      </Link>
    </div>
  );
}
