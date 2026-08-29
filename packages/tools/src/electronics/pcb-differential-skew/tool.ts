import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcbDifferentialSkewInput = Readonly<{
  readonly positiveTraceDelaySeconds: number;
  readonly negativeTraceDelaySeconds: number;
}>;
export type PcbDifferentialSkewOutput = Readonly<{ skewSeconds: number }>;

export const calculatePcbDifferentialSkew = (
  i: PcbDifferentialSkewInput,
): PcbDifferentialSkewOutput => {
  const value = Math.abs(
    i.positiveTraceDelaySeconds - i.negativeTraceDelaySeconds,
  );
  if (!Number.isFinite(value))
    simpleError("skewSeconds", "The inputs produce a non-finite result.");
  return { skewSeconds: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    positiveTraceDelaySeconds: 1.02e-9,
    negativeTraceDelaySeconds: 1e-9,
  },
  output: { skewSeconds: 1.999999999999993e-11 },
} satisfies ToolExample<PcbDifferentialSkewInput, PcbDifferentialSkewOutput>;

export const tool = createSimpleTool({
  id: "electronics/pcb-differential-skew",
  title: "PCB Differential Skew",
  description:
    "Calculate absolute arrival-time skew between two PCB differential-pair traces from their measured or modeled propagation delays.",
  inputs: [
    {
      id: "positiveTraceDelaySeconds",
      kind: "number",
      label: "Positive Trace Delay (s)",
      unit: "s",
      minimum: 0,
    },
    {
      id: "negativeTraceDelaySeconds",
      kind: "number",
      label: "Negative Trace Delay (s)",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "skewSeconds", kind: "number", label: "Skew (s)", unit: "s" },
  ],
  calculate: (input) =>
    calculatePcbDifferentialSkew({
      positiveTraceDelaySeconds: input.positiveTraceDelaySeconds as number,
      negativeTraceDelaySeconds: input.negativeTraceDelaySeconds as number,
    }),
});
export const pcbDifferentialSkewTool = tool;
export const runPcbDifferentialSkew = tool.execute;
export default tool;
