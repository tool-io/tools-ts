import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dilutedProteinMgMl: number;
  readonly dilutionFactor: number;
}>;
export type Output = Readonly<{
  readonly originalProteinMgMl: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.dilutedProteinMgMl < 0 || input.dilutionFactor <= 0)
    simpleError(
      "dilutionFactor",
      "Nonnegative concentration and positive dilution factor required.",
    );
  return {
    originalProteinMgMl: input.dilutedProteinMgMl * input.dilutionFactor,
  };
};
export const exampleInput = {
  dilutedProteinMgMl: 2,
  dilutionFactor: 5,
} satisfies Input;
export const exampleOutput = { originalProteinMgMl: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-dilution-backcalculation",
  title: "Protein Dilution Backcalculation",
  description: "Back-calculate original protein concentration after dilution.",
  inputs: [
    {
      id: "dilutedProteinMgMl",
      label: "Diluted protein mg ml",
      kind: "number",
    },
    { id: "dilutionFactor", label: "Dilution factor", kind: "number" },
  ],
  outputs: [
    {
      id: "originalProteinMgMl",
      label: "Original protein mg ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dilutedProteinMgMl: value.dilutedProteinMgMl as number,
      dilutionFactor: value.dilutionFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
