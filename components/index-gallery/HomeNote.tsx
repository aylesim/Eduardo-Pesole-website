import Link from "next/link";

type Props = {
  className?: string;
  note: string;
  showreelLabel: string;
};

export default function HomeNote({
  className,
  note,
  showreelLabel,
}: Props) {
  return (
    <div className={className}>
      <p className="max-w-[28ch] font-mono text-[0.75rem] font-medium leading-[1.45] tracking-[0.08em] text-[#151417] uppercase">
        {note}
      </p>
      <Link
        href="/about#showreel"
        className="pointer-events-auto mt-3 inline-flex font-mono text-[0.75rem] font-semibold tracking-[0.08em] text-[#151417] uppercase underline decoration-1 underline-offset-4"
      >
        {showreelLabel}
      </Link>
    </div>
  );
}
