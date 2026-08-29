import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pgvPgaCorrelationApproximationExample = {
  input: { pgaCmS2: 300 },
  output: { pgvCmS: 23.8732414637843 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const pgvPgaCorrelationApproximationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ pgaCmS2, referencePeriodS }) => {
      const period = referencePeriodS ?? 0.5;
      if (!(period > 0))
        simpleError("referencePeriodS", "Reference period must be positive.");
      return { pgvCmS: (pgaCmS2 * period) / (2 * Math.PI) };
    })(input as never) as Record<string, unknown>,
  description:
    "Approximate PGV from PGA by treating the motion as a sinusoid with effective period T_ref: PGV ≈ PGA·T_ref/(2π); this is a kinematic estimate, not an empirical ground-motion conversion.",
  id: "seismology/pgv-pga-correlation-approximation",
  inputs: [
    {
      minimum: 0,
      description: "Peak ground acceleration.",
      id: "pgaCmS2",
      kind: "number",
      label: "PGA",
      unit: "cm/s²",
    },
    {
      default: 0.5,
      description: "Effective correlation period.",
      id: "referencePeriodS",
      kind: "number",
      label: "T_ref",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Estimated peak ground velocity.",
      id: "pgvCmS",
      kind: "number",
      label: "PGV",
      unit: "cm/s",
    },
  ],
  title: "PGV PGA Correlation Approximation Calculator",
});
export const runPgvPgaCorrelationApproximation =
  pgvPgaCorrelationApproximationTool.execute;
export { pgvPgaCorrelationApproximationExample as example };
export default pgvPgaCorrelationApproximationTool;
