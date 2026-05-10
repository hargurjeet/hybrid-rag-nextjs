import type { EvaluationRecord } from "@/types/rag";

interface ResultsTableProps {
  results: EvaluationRecord[];
}

const SCORE_COLS = new Set(["faithfulness", "answer_relevancy"]);
const COL_ORDER = ["question", "answer", "faithfulness", "answer_relevancy"];

function formatCell(col: string, val: unknown): { text: string; isScore: boolean; passed?: boolean } {
  if (val === null || val === undefined) return { text: "—", isScore: false };
  if (SCORE_COLS.has(col) && typeof val === "number") {
    return { text: val.toFixed(3), isScore: true, passed: val >= 0.7 };
  }
  const str = String(val);
  return { text: str.length > 140 ? str.slice(0, 140) + "…" : str, isScore: false };
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) return null;

  const allKeys = Object.keys(results[0]);
  const ordered = COL_ORDER.filter((k) => allKeys.includes(k));
  const rest = allKeys.filter((k) => !COL_ORDER.includes(k));
  const columns = [...ordered, ...rest];

  return (
    <div
      className="overflow-hidden rounded-xl border animate-fade-in"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="border-b px-4 py-2.5"
        style={{ borderColor: "var(--border)", background: "var(--apple-surface-2)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Results · {results.length} samples
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Evaluation results">
          <thead>
            <tr style={{ background: "var(--apple-surface-2)", borderBottom: "1px solid var(--border)" }}>
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr
                key={i}
                className="border-t transition-colors hover:bg-secondary/40"
                style={{ borderColor: "var(--border)" }}
              >
                {columns.map((col) => {
                  const { text, isScore, passed } = formatCell(col, row[col]);
                  return (
                    <td key={col} className="px-4 py-3 text-xs text-muted-foreground max-w-[220px]">
                      {isScore ? (
                        <span
                          className="font-semibold tabular-nums"
                          style={{ color: passed ? "var(--apple-green)" : "var(--apple-red)" }}
                        >
                          {text}
                        </span>
                      ) : (
                        <span className="line-clamp-2">{text}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
