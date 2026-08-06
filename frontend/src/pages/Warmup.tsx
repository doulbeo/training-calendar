import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { warmupPhases, executionNotes } from "@/data/warmupData";

export default function Warmup() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState(0);

  return (
    <PageTransition transition="slide-up">
      <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border text-foreground hover:bg-secondary hover:border-primary/30 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">热身清单</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              四阶段训练前热身流程
            </p>
          </div>
        </div>

        {/* Phase Navigator */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
          {warmupPhases.map((phase, i) => (
            <button
              key={i}
              onClick={() => setActivePhase(i)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                i === activePhase
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <span className="mr-1">{phase.icon}</span>
              第{i + 1}阶段
            </button>
          ))}
        </div>

        {/* Active Phase */}
        <div className="space-y-4">
          {warmupPhases.map((phase, pi) => (
            <section
              key={pi}
              className={pi === activePhase ? "block" : "hidden"}
            >
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">{phase.icon}</span>
                  <h2 className="text-lg font-bold">{phase.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {phase.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                {phase.exercises.map((ex, ei) => (
                  <div
                    key={ei}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                        {ei + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {ex.name}
                        </h3>
                        <ul className="mt-2.5 space-y-1.5">
                          {ex.instructions.map((step, si) => (
                            <li
                              key={si}
                              className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed"
                            >
                              <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                        {ex.note && (
                          <p className="mt-2.5 text-xs text-primary bg-primary/10 rounded-lg px-3 py-2 flex items-start gap-1.5">
                            <span className="shrink-0">💡</span>
                            <span>{ex.note}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Execution Notes */}
        <div className="mt-8 bg-primary/5 border border-primary/15 rounded-xl p-5">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <span>✅</span> 执行建议
          </h3>
          <ul className="space-y-2.5">
            {executionNotes.map((note, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground flex items-start gap-2.5"
              >
                <span className="shrink-0 mt-0.5">{note.icon}</span>
                <span>{note.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 pb-4">
          建议训练前完成全部四个阶段，确保身体充分准备
        </p>
      </div>
    </PageTransition>
  );
}
