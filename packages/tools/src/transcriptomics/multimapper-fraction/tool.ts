import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ambiguousReads: number;
  readonly mappedReads: number;
  readonly maximumAmbiguousPercent: number;
}>;
export type Output = Readonly<{
  readonly ambiguousPercent: number;
  readonly uniqueReads: number;
  readonly passes: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.mappedReads <= 0 ||
    input.ambiguousReads < 0 ||
    input.ambiguousReads > input.mappedReads
  )
    simpleError(
      "ambiguousReads",
      "Ambiguous reads cannot exceed positive mapped reads.",
    );
  const ambiguousPercent = (input.ambiguousReads / input.mappedReads) * 100;
  return {
    ambiguousPercent,
    uniqueReads: input.mappedReads - input.ambiguousReads,
    passes: ambiguousPercent <= input.maximumAmbiguousPercent,
  };
};

export const exampleInput = {
  ambiguousReads: 20,
  mappedReads: 100,
  maximumAmbiguousPercent: 10,
} satisfies Input;
export const exampleOutput = {
  ambiguousPercent: 20,
  uniqueReads: 80,
  passes: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/multimapper-fraction",
  title: "Multimapper Fraction",
  description: "Measure ambiguous multi-mapper assignment share.",
  inputs: [
    { id: "ambiguousReads", kind: "number", label: "Ambiguous reads" },
    { id: "mappedReads", kind: "number", label: "Mapped reads" },
    {
      id: "maximumAmbiguousPercent",
      kind: "number",
      label: "Maximum ambiguous percent",
    },
  ],
  outputs: [
    { id: "ambiguousPercent", kind: "number", label: "Ambiguous percent" },
    { id: "uniqueReads", kind: "number", label: "Unique reads" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      ambiguousReads: value.ambiguousReads as number,
      mappedReads: value.mappedReads as number,
      maximumAmbiguousPercent: value.maximumAmbiguousPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
