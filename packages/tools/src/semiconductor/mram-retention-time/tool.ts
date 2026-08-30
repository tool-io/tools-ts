import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MramRetentionTimeInput = Readonly<{
  readonly attemptSeconds: number;
  readonly stabilityFactor: number;
}>;
export type MramRetentionTimeOutput = Readonly<{
  readonly retentionSeconds: number;
}>;

export const calculateMramRetentionTime = (
  x: MramRetentionTimeInput,
): MramRetentionTimeOutput => {
  if (!Number.isFinite(x.attemptSeconds) || x.attemptSeconds < 0)
    simpleError("attemptSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.stabilityFactor) || x.stabilityFactor < 0)
    simpleError("stabilityFactor", "Provide a finite number at least 0.");
  const retentionSeconds = x.attemptSeconds * Math.exp(x.stabilityFactor);
  if (!Number.isFinite(retentionSeconds))
    simpleError(
      "retentionSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    retentionSeconds: Object.is(retentionSeconds, -0) ? 0 : retentionSeconds,
  };
};

export const example = {
  input: { attemptSeconds: 1e-9, stabilityFactor: 20 },
  output: { retentionSeconds: 0.4851651954097903 },
} satisfies ToolExample<MramRetentionTimeInput, MramRetentionTimeOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/mram-retention-time",
  title: "MRAM Retention Time",
  description:
    "Néel–Arrhenius MRAM retention estimate τ=τ₀ exp(Δ) from attempt time and dimensionless thermal-stability factor.",
  inputs: [
    {
      id: "attemptSeconds",
      kind: "number",
      label: "Attempt Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "stabilityFactor",
      kind: "number",
      label: "Stability Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "retentionSeconds",
      kind: "number",
      label: "Retention Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateMramRetentionTime({
      attemptSeconds: input.attemptSeconds as number,
      stabilityFactor: input.stabilityFactor as number,
    }),
});
export const mramRetentionTimeTool = tool;
export const runMramRetentionTime = tool.execute;
export default tool;
