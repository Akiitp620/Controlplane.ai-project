import {
  Bot,
  Headphones,
  Library,
  Scale,
} from "lucide-react";

const useCases = [
  {
    title: "Customer Support",
    description:
      "Govern conversational AI while maintaining fast response times for lower-risk interactions.",
    requirement: "Moderate risk tolerance",
    icon: Headphones,
  },
  {
    title: "Internal Knowledge",
    description:
      "Keep enterprise knowledge assistants grounded in trusted organisational sources.",
    requirement: "Evidence-aware",
    icon: Library,
  },
  {
    title: "Decision Support",
    description:
      "Apply stronger controls when AI recommendations can influence consequential decisions.",
    requirement: "Human oversight",
    icon: Scale,
  },
  {
    title: "AI Agent Actions",
    description:
      "Apply stronger governance when AI moves beyond generating text and starts taking actions.",
    requirement: "Action-aware controls",
    icon: Bot,
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-20 bg-white py-24 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Use cases
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            One control layer. Different risk profiles.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
            Different AI applications require different levels of governance.
            ControlPlane adapts the control approach to the context.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:border-white/10 dark:text-blue-300">
                  {item.requirement}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}