import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly putrescine: number;
  readonly spermidine: number;
  readonly spermine: number;
}>;
export type Output = Readonly<{
  readonly totalPolyamines: number;
  readonly spermineSharePercent: number;
  readonly dominantStage: string;
}>;
export const calculate = (input: Input): Output => {
  if (Math.min(input.putrescine, input.spermidine, input.spermine) < 0)
    simpleError("putrescine", "Concentrations must be nonnegative.");
  const totalPolyamines = input.putrescine + input.spermidine + input.spermine;
  if (totalPolyamines <= 0)
    simpleError("putrescine", "Total polyamines must be positive.");
  const dominantStage =
    input.spermine >= input.spermidine && input.spermine >= input.putrescine
      ? "spermine"
      : input.spermidine >= input.putrescine
        ? "spermidine"
        : "putrescine";
  return {
    totalPolyamines,
    spermineSharePercent: (input.spermine / totalPolyamines) * 100,
    dominantStage,
  };
};
export const exampleInput = {
  putrescine: 2,
  spermidine: 4,
  spermine: 6,
} satisfies Input;
export const exampleOutput = {
  totalPolyamines: 12,
  spermineSharePercent: 50,
  dominantStage: "spermine",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/polyamine-progression",
  title: "Polyamine Progression",
  description:
    "Summarize a caller-measured putrescine-to-spermine abundance profile.",
  inputs: [
    { id: "putrescine", kind: "number", label: "Putrescine" },
    { id: "spermidine", kind: "number", label: "Spermidine" },
    { id: "spermine", kind: "number", label: "Spermine" },
  ],
  outputs: [
    { id: "totalPolyamines", kind: "number", label: "Total polyamines" },
    {
      id: "spermineSharePercent",
      kind: "number",
      label: "Spermine share percent",
    },
    { id: "dominantStage", kind: "string", label: "Dominant stage" },
  ],
  calculate: (value) =>
    calculate({
      putrescine: value.putrescine as number,
      spermidine: value.spermidine as number,
      spermine: value.spermine as number,
    }),
});
export const run = tool.execute;
export default tool;
