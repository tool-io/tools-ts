import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reducedGsh: number;
  readonly oxidizedGssg: number;
  readonly minimumLog10Ratio: number;
}>;
export type Output = Readonly<{
  readonly gshToGssg: number;
  readonly log10Ratio: number;
  readonly passes: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.reducedGsh <= 0 || input.oxidizedGssg <= 0)
    simpleError("oxidizedGssg", "Glutathione measures must be positive.");
  const gshToGssg = input.reducedGsh / input.oxidizedGssg,
    log10Ratio = Math.log10(gshToGssg);
  return {
    gshToGssg,
    log10Ratio,
    passes: log10Ratio >= input.minimumLog10Ratio,
  };
};
export const exampleInput = {
  reducedGsh: 100,
  oxidizedGssg: 10,
  minimumLog10Ratio: 0.5,
} satisfies Input;
export const exampleOutput = {
  gshToGssg: 10,
  log10Ratio: 1,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/glutathione-redox-index",
  title: "Glutathione Redox Index",
  description:
    "Screen glutathione redox ratio against a supplied log10 threshold.",
  inputs: [
    { id: "reducedGsh", kind: "number", label: "Reduced gsh" },
    { id: "oxidizedGssg", kind: "number", label: "Oxidized gssg" },
    { id: "minimumLog10Ratio", kind: "number", label: "Minimum log 10 ratio" },
  ],
  outputs: [
    { id: "gshToGssg", kind: "number", label: "Gsh to gssg" },
    { id: "log10Ratio", kind: "number", label: "Log 10 ratio" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      reducedGsh: value.reducedGsh as number,
      oxidizedGssg: value.oxidizedGssg as number,
      minimumLog10Ratio: value.minimumLog10Ratio as number,
    }),
});
export const run = tool.execute;
export default tool;
