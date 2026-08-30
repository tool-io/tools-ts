import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly acetylCoa: number;
  readonly freeCoa: number;
}>;
export type Output = Readonly<{
  readonly acetylToFreeRatio: number;
  readonly acetylSharePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.acetylCoa < 0 || input.freeCoa <= 0)
    simpleError("freeCoa", "Free CoA must be positive.");
  return {
    acetylToFreeRatio: input.acetylCoa / input.freeCoa,
    acetylSharePercent:
      (input.acetylCoa / (input.acetylCoa + input.freeCoa)) * 100,
  };
};
export const exampleInput = { acetylCoa: 30, freeCoa: 10 } satisfies Input;
export const exampleOutput = {
  acetylToFreeRatio: 3,
  acetylSharePercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/acetylcoa-coa-ratio",
  title: "Acetylcoa Coa Ratio",
  description:
    "Calculate acetyl-CoA to free-CoA abundance ratio and acylated share.",
  inputs: [
    { id: "acetylCoa", kind: "number", label: "Acetyl coa" },
    { id: "freeCoa", kind: "number", label: "Free coa" },
  ],
  outputs: [
    { id: "acetylToFreeRatio", kind: "number", label: "Acetyl to free ratio" },
    { id: "acetylSharePercent", kind: "number", label: "Acetyl share percent" },
  ],
  calculate: (value) =>
    calculate({
      acetylCoa: value.acetylCoa as number,
      freeCoa: value.freeCoa as number,
    }),
});
export const run = tool.execute;
export default tool;
