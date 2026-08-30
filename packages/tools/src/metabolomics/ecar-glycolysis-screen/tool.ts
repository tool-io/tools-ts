import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ecarMpHPerMin: number;
  readonly minimumGlycolysisProxy: number;
}>;
export type Output = Readonly<{
  readonly proxyAboveThreshold: boolean;
  readonly thresholdMargin: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.ecarMpHPerMin < 0 || input.minimumGlycolysisProxy < 0)
    simpleError("ecarMpHPerMin", "ECAR and cutoff must be nonnegative.");
  return {
    proxyAboveThreshold: input.ecarMpHPerMin >= input.minimumGlycolysisProxy,
    thresholdMargin: input.ecarMpHPerMin - input.minimumGlycolysisProxy,
  };
};
export const exampleInput = {
  ecarMpHPerMin: 40,
  minimumGlycolysisProxy: 30,
} satisfies Input;
export const exampleOutput = {
  proxyAboveThreshold: true,
  thresholdMargin: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/ecar-glycolysis-screen",
  title: "ECAR Glycolysis Screen",
  description:
    "Screen extracellular acidification rate as a glycolysis proxy using a caller cutoff.",
  inputs: [
    { id: "ecarMpHPerMin", kind: "number", label: "Ecar mp h per min" },
    {
      id: "minimumGlycolysisProxy",
      kind: "number",
      label: "Minimum glycolysis proxy",
    },
  ],
  outputs: [
    {
      id: "proxyAboveThreshold",
      kind: "boolean",
      label: "Proxy above threshold",
    },
    { id: "thresholdMargin", kind: "number", label: "Threshold margin" },
  ],
  calculate: (value) =>
    calculate({
      ecarMpHPerMin: value.ecarMpHPerMin as number,
      minimumGlycolysisProxy: value.minimumGlycolysisProxy as number,
    }),
});
export const run = tool.execute;
export default tool;
