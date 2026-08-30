import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly referenceRetentionSeconds: number;
  readonly observedRetentionSeconds: number;
  readonly maximumDriftSeconds: number;
}>;
export type Output = Readonly<{
  readonly driftSeconds: number;
  readonly withinWindow: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.referenceRetentionSeconds < 0 ||
    input.observedRetentionSeconds < 0 ||
    input.maximumDriftSeconds < 0
  )
    simpleError(
      "referenceRetentionSeconds",
      "Retention times and drift tolerance must be nonnegative.",
    );
  const driftSeconds =
    input.observedRetentionSeconds - input.referenceRetentionSeconds;
  return {
    driftSeconds,
    withinWindow: Math.abs(driftSeconds) <= input.maximumDriftSeconds,
  };
};
export const exampleInput = {
  referenceRetentionSeconds: 100,
  observedRetentionSeconds: 102,
  maximumDriftSeconds: 3,
} satisfies Input;
export const exampleOutput = {
  driftSeconds: 2,
  withinWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/retention-time-drift",
  title: "Retention Time Drift",
  description:
    "Screen chromatographic retention-time drift against an alignment window.",
  inputs: [
    {
      id: "referenceRetentionSeconds",
      kind: "number",
      label: "Reference retention seconds",
    },
    {
      id: "observedRetentionSeconds",
      kind: "number",
      label: "Observed retention seconds",
    },
    {
      id: "maximumDriftSeconds",
      kind: "number",
      label: "Maximum drift seconds",
    },
  ],
  outputs: [
    { id: "driftSeconds", kind: "number", label: "Drift seconds" },
    { id: "withinWindow", kind: "boolean", label: "Within window" },
  ],
  calculate: (value) =>
    calculate({
      referenceRetentionSeconds: value.referenceRetentionSeconds as number,
      observedRetentionSeconds: value.observedRetentionSeconds as number,
      maximumDriftSeconds: value.maximumDriftSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
