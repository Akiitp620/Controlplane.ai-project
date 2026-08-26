import {
  ArrowRight,
  Ban,
  CheckCircle2,
  Edit3,
  UserCheck,
} from "lucide-react";

const decisions = [
  {
    title: "Allow",
    description: "Appropriate for autonomous handling.",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  {
    title: "Modify",
    description: "Correct or constrain before delivery.",
    icon: Edit3,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  },
  {
    title: "Human Review",
    description: "Human judgment required before proceeding.",
    icon: UserCheck,
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300",
  },
  {
    title: "Block",
    description: "Do not allow the output or action to proceed.",
    icon: Ban,
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
  },
];

export default function Autonomy() {
  return (
    <section
      id="autonomy"
      className="scroll-mt-20 bg-slate-50 py-24 dark:bg-slate-900/40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Context-aware autonomy
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Not every AI decision deserves the same autonomy.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              ControlPlane does not only ask whether an AI output is risky.
              It asks how much autonomy is appropriate for the situation.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
              Context → Risk → Evidence → Consequence → Policy → Autonomy
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {decisions.map((decision) => {
              const Icon = decision.icon;

              return (
                <div
                  key={decision.title}
                  className={`rounded-2xl border p-6 ${decision.className}`}
                >
                  <Icon className="h-6 w-6" />

                  <h3 className="mt-5 text-lg font-semibold">
                    {decision.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 opacity-80">
                    {decision.description}
                  </p>

                  <ArrowRight className="mt-5 h-4 w-4 opacity-50" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}