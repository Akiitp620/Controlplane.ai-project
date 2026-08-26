import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-white py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center shadow-2xl sm:px-12 dark:border dark:border-white/10">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Give your AI the right level of autonomy.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
              Build AI systems that move fast without losing the human
              oversight that matters.
            </p>

            <Link
              href="/dashboard"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100"
            >
              Launch ControlPlane
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}