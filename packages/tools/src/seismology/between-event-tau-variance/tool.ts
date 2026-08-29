import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const betweenEventTauVarianceCalculatorExample = {
  input: { eventResidualsLn: [0.2, -0.1, 0.4] },
  output: { tauVariance: 0.06333333333333335, tauStdDev: 0.2516611478423584 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const betweenEventTauVarianceCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eventResidualsLn }) => {
      const xs = eventResidualsLn as number[];
      if (!Array.isArray(xs) || xs.length < 2)
        simpleError("eventResidualsLn", "Need at least two events.");
      const n = xs.length;
      const mean = xs.reduce((a, b) => a + b, 0) / n;
      const tauVariance = xs.reduce((a, x) => a + (x - mean) ** 2, 0) / (n - 1);
      return { tauVariance, tauStdDev: Math.sqrt(tauVariance) };
    })(input as never) as Record<string, unknown>,
  description:
    "Between-event tau variance decomposition across multiple events.",
  id: "seismology/between-event-tau-variance",
  inputs: [
    {
      description: "Per-event average residuals (ln units).",
      id: "eventResidualsLn",
      kind: "numberList",
      label: "δBᵢ",
    },
  ],
  outputs: [
    {
      description: "Sample variance of event terms.",
      id: "tauVariance",
      kind: "number",
      label: "τ²",
    },
    {
      description: "Standard deviation of event terms.",
      id: "tauStdDev",
      kind: "number",
      label: "τ",
    },
  ],
  title: "Between Event Tau Variance Calculator",
});
export const runBetweenEventTauVarianceCalculator =
  betweenEventTauVarianceCalculatorTool.execute;
export { betweenEventTauVarianceCalculatorExample as example };
export default betweenEventTauVarianceCalculatorTool;
