import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly purpleCells: number;
  readonly pinkCells: number;
  readonly minimumMinorityFraction: number;
  readonly controlsPassed: boolean;
}>;
export type Output = Readonly<{
  readonly purpleFraction: number;
  readonly pinkFraction: number;
  readonly mixedReactionFlag: boolean;
  readonly interpretable: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.purpleCells, "purpleCells");
  count(input.pinkCells, "pinkCells");
  fraction(input.minimumMinorityFraction, "minimumMinorityFraction");
  if (input.minimumMinorityFraction > 0.5)
    simpleError(
      "minimumMinorityFraction",
      "Minority fraction cannot exceed one-half.",
    );
  const total = input.purpleCells + input.pinkCells;
  positive(total, "purpleCells");
  const purpleFraction = input.purpleCells / total,
    pinkFraction = input.pinkCells / total;
  return {
    purpleFraction,
    pinkFraction,
    mixedReactionFlag:
      input.controlsPassed &&
      Math.min(purpleFraction, pinkFraction) >= input.minimumMinorityFraction,
    interpretable: input.controlsPassed,
  };
};
export const exampleInput = {
  purpleCells: 30,
  pinkCells: 70,
  minimumMinorityFraction: 0.1,
  controlsPassed: true,
} satisfies Input;
export const exampleOutput = {
  purpleFraction: 0.3,
  pinkFraction: 0.7,
  mixedReactionFlag: true,
  interpretable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/gram-mixture-control-audit",
  title: "Gram Mixture Control Audit",
  description:
    "Screen mixed Gram-stain cell-color observations with a supplied minority criterion and control validity; mixture does not distinguish contamination from Gram variability.",
  inputs: [
    { id: "purpleCells", label: "Purple cells", kind: "integer", minimum: 0 },
    { id: "pinkCells", label: "Pink cells", kind: "integer", minimum: 0 },
    {
      id: "minimumMinorityFraction",
      label: "Minimum minority fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    { id: "controlsPassed", label: "Controls passed", kind: "boolean" },
  ],
  outputs: [
    { id: "purpleFraction", label: "Purple fraction", kind: "number" },
    { id: "pinkFraction", label: "Pink fraction", kind: "number" },
    { id: "mixedReactionFlag", label: "Mixed reaction flag", kind: "boolean" },
    { id: "interpretable", label: "Interpretable", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      purpleCells: value.purpleCells as number,
      pinkCells: value.pinkCells as number,
      minimumMinorityFraction: value.minimumMinorityFraction as number,
      controlsPassed: value.controlsPassed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
