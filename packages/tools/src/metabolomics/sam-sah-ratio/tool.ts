import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sam: number;
  readonly sah: number;
  readonly minimumRatio: number;
}>;
export type Output = Readonly<{
  readonly methylationPotentialRatio: number;
  readonly passes: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.sam < 0 || input.sah <= 0)
    simpleError("sah", "SAH must be positive and SAM nonnegative.");
  const methylationPotentialRatio = input.sam / input.sah;
  return {
    methylationPotentialRatio,
    passes: methylationPotentialRatio >= input.minimumRatio,
  };
};
export const exampleInput = {
  sam: 20,
  sah: 5,
  minimumRatio: 3,
} satisfies Input;
export const exampleOutput = {
  methylationPotentialRatio: 4,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/sam-sah-ratio",
  title: "SAM SAH Ratio",
  description: "Screen methylation potential with a supplied SAM/SAH cutoff.",
  inputs: [
    { id: "sam", kind: "number", label: "Sam" },
    { id: "sah", kind: "number", label: "Sah" },
    { id: "minimumRatio", kind: "number", label: "Minimum ratio" },
  ],
  outputs: [
    {
      id: "methylationPotentialRatio",
      kind: "number",
      label: "Methylation potential ratio",
    },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      sam: value.sam as number,
      sah: value.sah as number,
      minimumRatio: value.minimumRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
