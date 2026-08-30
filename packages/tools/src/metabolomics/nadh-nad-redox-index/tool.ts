import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nadh: number;
  readonly nad: number;
  readonly referenceLog10Ratio: number;
}>;
export type Output = Readonly<{
  readonly log10RedoxRatio: number;
  readonly aboveReference: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.nadh <= 0 || input.nad <= 0)
    simpleError("nad", "Both NADH and NAD+ must be positive.");
  const log10RedoxRatio = Math.log10(input.nadh / input.nad);
  return {
    log10RedoxRatio,
    aboveReference: log10RedoxRatio >= input.referenceLog10Ratio,
  };
};
export const exampleInput = {
  nadh: 100,
  nad: 10,
  referenceLog10Ratio: 0.5,
} satisfies Input;
export const exampleOutput = {
  log10RedoxRatio: 1,
  aboveReference: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nadh-nad-redox-index",
  title: "NADH NAD Redox Index",
  description:
    "Compare cellular NADH/NAD+ log10 ratio to a supplied reference.",
  inputs: [
    { id: "nadh", kind: "number", label: "Nadh" },
    { id: "nad", kind: "number", label: "Nad" },
    {
      id: "referenceLog10Ratio",
      kind: "number",
      label: "Reference log 10 ratio",
    },
  ],
  outputs: [
    { id: "log10RedoxRatio", kind: "number", label: "Log 10 redox ratio" },
    { id: "aboveReference", kind: "boolean", label: "Above reference" },
  ],
  calculate: (value) =>
    calculate({
      nadh: value.nadh as number,
      nad: value.nad as number,
      referenceLog10Ratio: value.referenceLog10Ratio as number,
    }),
});
export const run = tool.execute;
export default tool;
