import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const productLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Evaluate", href: "/evaluate" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Policies", href: "/policies" },
];

const governanceLinks = [
  { label: "Knowledge Base", href: "/knowledge-base" },
  { label: "Human Review", href: "/review" },
  { label: "Audit Trail", href: "/audit" },
  { label: "Metrics", href: "/metrics" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>

              <span className="text-[17px] font-semibold text-slate-950 dark:text-white">
                ControlPlane<span className="text-blue-600">.ai</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              A context-aware AI governance and autonomy control layer designed
              for responsible enterprise AI.
            </p>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Governance" links={governanceLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-slate-500">
          <span>© 2026 ControlPlane.ai</span>
          <span>Built by Young Innovators · Accenture Innovation Challenge 2026</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}