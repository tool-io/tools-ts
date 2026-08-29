import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const significantDurationArias595Example = {
  input: { intervalEnergies: [0, 1, 2, 3, 2, 1, 0] },
  output: { significantDurationIntervals: 5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const significantDurationArias595Tool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ intervalEnergies }) => {
      const xs = intervalEnergies as unknown[];
      if (!Array.isArray(xs) || xs.length === 0)
        simpleError("intervalEnergies", "Provide contributions.");
      const es = xs as number[];
      if (es.some((energy) => energy < 0))
        simpleError(
          "intervalEnergies",
          "Energy contributions cannot be negative.",
        );
      const total = es.reduce((a, b) => a + b, 0);
      if (total <= 0)
        simpleError(
          "intervalEnergies",
          "Energies must sum to a positive value.",
        );
      let cumulative = 0;
      let start = -1;
      let end = es.length - 1;
      for (let i = 0; i < es.length; i++) {
        cumulative += es[i];
        if (start < 0 && cumulative >= 0.05 * total) start = i;
        if (cumulative >= 0.95 * total) {
          end = i;
          break;
        }
      }
      return { significantDurationIntervals: end - start + 1 };
    })(input as never) as Record<string, unknown>,
  description:
    "Significant duration bracketing the 5–95% Arias interval from per-interval energy contributions.",
  id: "seismology/significant-duration-arias-5-95",
  inputs: [
    {
      description: "Per-interval a²·Δt contributions.",
      id: "intervalEnergies",
      kind: "numberList",
      label: "E_i",
    },
  ],
  outputs: [
    {
      description: "Number of intervals spanning 5–95% of Arias.",
      id: "significantDurationIntervals",
      kind: "number",
      label: "N_5–95",
    },
  ],
  title: "Significant Duration Arias 5 To 95 Calculator",
});
export const runSignificantDurationArias595 =
  significantDurationArias595Tool.execute;
export { significantDurationArias595Example as example };
export default significantDurationArias595Tool;
