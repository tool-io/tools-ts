import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly twoAg: number;
  readonly anandamide: number;
}>;
export type Output = Readonly<{
  readonly abundanceRatio: number;
  readonly twoAgSharePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.twoAg < 0 || input.anandamide <= 0)
    simpleError(
      "anandamide",
      "2-AG must be nonnegative and anandamide positive.",
    );
  return {
    abundanceRatio: input.twoAg / input.anandamide,
    twoAgSharePercent: (input.twoAg / (input.twoAg + input.anandamide)) * 100,
  };
};
export const exampleInput = { twoAg: 20, anandamide: 5 } satisfies Input;
export const exampleOutput = {
  abundanceRatio: 4,
  twoAgSharePercent: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/endocannabinoid-ratio",
  title: "Endocannabinoid Ratio",
  description: "Compare 2-AG and anandamide abundances.",
  inputs: [
    { id: "twoAg", kind: "number", label: "Two ag" },
    { id: "anandamide", kind: "number", label: "Anandamide" },
  ],
  outputs: [
    { id: "abundanceRatio", kind: "number", label: "Abundance ratio" },
    { id: "twoAgSharePercent", kind: "number", label: "Two ag share percent" },
  ],
  calculate: (value) =>
    calculate({
      twoAg: value.twoAg as number,
      anandamide: value.anandamide as number,
    }),
});
export const run = tool.execute;
export default tool;
