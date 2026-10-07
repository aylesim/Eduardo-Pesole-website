import Link from "next/link";
import type { ServiceOffer } from "@/lib/types";

type ServiceCardsProps = {
  services: ServiceOffer[];
};

const MARKS: Record<string, string> = {
  games: "▶",
  installations: "◎",
  composition: "♫",
  mix: "≋",
};

const toneClass = (index: number) => {
  if (index % 3 === 1) return "service-card-link--warm";
  if (index % 3 === 2) return "service-card-link--lilac";
  return "service-card-link--base";
};

const slantClass = (index: number) =>
  index % 2 === 0 ? "service-card-link--slant-a" : "service-card-link--slant-b";

function ServiceCard({
  service,
  index,
}: {
  service: ServiceOffer;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const mark = MARKS[service.id] ?? "◆";

  return (
    <li className="service-card-item">
      <Link
        href={`/about#contacts?topic=${service.id}`}
        className={`service-card-link ${toneClass(index)} ${slantClass(index)}`}
      >
        <span className="service-card-head">
          <span className="service-card-stamp" aria-hidden="true">
            {num}
          </span>
          <span className="service-card-mark" aria-hidden="true">
            {mark}
          </span>
        </span>

        <h2 className="service-card-title">{service.title}</h2>

        <p className="service-card-copy">
          {service.line1}
          {service.line2 ? (
            <>
              <br />
              {service.line2}
            </>
          ) : null}
        </p>

        <span className="service-card-cta">{service.cta} →</span>
      </Link>
    </li>
  );
}

export default function ServiceCards({ services }: ServiceCardsProps) {
  return (
    <ul className="service-card-grid">
      {services.map((service, i) => (
        <ServiceCard key={service.id} service={service} index={i} />
      ))}
    </ul>
  );
}
