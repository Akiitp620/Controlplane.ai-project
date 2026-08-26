import {
  ArrowDown,
  FileCheck2,
  Gauge,
  Scale,
  ShieldCheck,
} from "lucide-react";

const stages = [
  {
    title: "Context",
    text: "Where is the AI being used?",
    icon: ShieldCheck,
  },
  {
    title: "Risk",
    text: "What could go wrong?",
    icon: Gauge,
  },
  {
    title: "Evidence",
    text: "What supports the claim?",
    icon: FileCheck2,
  },
  {
    title: "Policy",
    text: "What governance rules apply?",
    icon: Scale,
  },
];

export default function ProductPreview() {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Control layer
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Multiple signals. One explainable decision.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            ControlPlane brings the signals that matter together before
            deciding how an AI output should be handled.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid gap-3 md:grid-cols-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <div key={stage.title} className="relative">
                  <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 font-semibold text-slate-950 dark:text-white">
                      {stage.title}
                    </h3>

                    <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {stage.text}
                    </p>
                  </div>

                  {index < stages.length - 1 && (
                    <ArrowDown className="mx-auto my-2 h-4 w-4 text-slate-300 md:absolute md:-right-3 md:top-1/2 md:my-0 md:rotate-[-90deg] dark:text-slate-700" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-400/20 dark:bg-blue-400/10">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">
              Final autonomy decision
            </div>

            <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              Allow · Modify · Human Review · Block
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}