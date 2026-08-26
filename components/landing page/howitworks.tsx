import {
  BrainCircuit,
  FileCheck2,
  Gauge,
  Layers3,
  Scale,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Context",
    description:
      "Understand where and how the AI output is being used.",
    icon: BrainCircuit,
  },
  {
    number: "02",
    title: "Risk",
    description:
      "Identify hallucination, privacy, bias, safety and responsibility risks.",
    icon: Gauge,
  },
  {
    number: "03",
    title: "Evidence",
    description:
      "Check important claims against trusted sources where evidence is available.",
    icon: FileCheck2,
  },
  {
    number: "04",
    title: "Consequence",
    description:
      "Assess what could happen if the AI output is acted upon.",
    icon: Layers3,
  },
  {
    number: "05",
    title: "Policy",
    description:
      "Apply governance rules appropriate to the specific use case.",
    icon: Scale,
  },
  {
    number: "06",
    title: "Autonomy",
    description:
      "Determine whether AI should act, be modified, reviewed or blocked.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-slate-50 py-24 dark:bg-slate-900/40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            From AI output to the right level of autonomy.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
            ControlPlane combines multiple signals before deciding how much
            autonomy an AI system should receive.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950 dark:hover:border-blue-400/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-sm font-semibold text-slate-300 dark:text-slate-700">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-slate-950 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}