import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fivePrimeUtrBp: number;
  readonly threePrimeUtrBp: number;
}>;
export type Output = Readonly<{
  readonly threeToFiveRatio: number;
  readonly totalUtrBp: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.fivePrimeUtrBp <= 0 || input.threePrimeUtrBp < 0)
    simpleError("fivePrimeUtrBp", "The 5-prime UTR must be positive.");
  return {
    threeToFiveRatio: input.threePrimeUtrBp / input.fivePrimeUtrBp,
    totalUtrBp: input.fivePrimeUtrBp + input.threePrimeUtrBp,
  };
};

export const exampleInput = {
  fivePrimeUtrBp: 100,
  threePrimeUtrBp: 200,
} satisfies Input;
export const exampleOutput = {
  threeToFiveRatio: 2,
  totalUtrBp: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/utr-length-ratio",
  title: "Utr Length Ratio",
  description: "Compare 3-prime and 5-prime UTR lengths.",
  inputs: [
    { id: "fivePrimeUtrBp", kind: "number", label: "Five prime utr bp" },
    { id: "threePrimeUtrBp", kind: "number", label: "Three prime utr bp" },
  ],
  outputs: [
    { id: "threeToFiveRatio", kind: "number", label: "Three to five ratio" },
    { id: "totalUtrBp", kind: "number", label: "Total utr bp" },
  ],
  calculate: (value) =>
    calculate({
      fivePrimeUtrBp: value.fivePrimeUtrBp as number,
      threePrimeUtrBp: value.threePrimeUtrBp as number,
    }),
});
export const run = tool.execute;
export default tool;
