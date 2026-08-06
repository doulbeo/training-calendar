import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { warmupCategories } from "@/data/warmupData";

export default function Warmup() {
  const navigate = useNavigate();

  return (
    <PageTransition transition="slide-up">
      <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border text-foreground hover:bg-secondary hover:border-primary/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">热身清单</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              训练前必做的热身动作
            </p>
          </div>
        </div>

        {/* Warmup Categories */}
        <div className="space-y-6">
          {warmupCategories.map((category, ci) => (
            <section
              key={ci}
              className="bg-card border border-border rounded-xl p-5 shadow-sm"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <span className="text-xl">{category.icon}</span>
                <span>{category.title}</span>
              </h2>

              <div className="space-y-3">
                {category.exercises.map((ex, ei) => (
                  <div
                    key={ei}
                    className="bg-background rounded-lg p-4 border border-border/50 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">
                          {ex.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {ex.description}
                        </p>
                        {ex.tips && (
                          <p className="text-xs text-primary mt-2 flex items-start gap-1.5">
                            <span className="shrink-0 mt-0.5">💡</span>
                            <span>{ex.tips}</span>
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {ex.reps}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8 pb-4">
          建议总热身时间：10-15 分钟，根据训练日重点调整动作选择
        </p>
      </div>
    </PageTransition>
  );
}
