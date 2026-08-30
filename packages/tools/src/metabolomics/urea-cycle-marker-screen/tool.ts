import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly arginine: number;
  readonly orotidine: number;
  readonly arginineMinimum: number;
  readonly orotidineMaximum: number;
}>;
export type Output = Readonly<{
  readonly arginineLow: boolean;
  readonly orotidineHigh: boolean;
  readonly crossCheckFlag: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.arginine < 0 || input.orotidine < 0)
    simpleError("arginine", "Marker concentrations must be nonnegative.");
  const arginineLow = input.arginine < input.arginineMinimum,
    orotidineHigh = input.orotidine > input.orotidineMaximum;
  return {
    arginineLow,
    orotidineHigh,
    crossCheckFlag: arginineLow && orotidineHigh,
  };
};
export const exampleInput = {
  arginine: 10,
  orotidine: 5,
  arginineMinimum: 8,
  orotidineMaximum: 4,
} satisfies Input;
export const exampleOutput = {
  arginineLow: false,
  orotidineHigh: true,
  crossCheckFlag: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/urea-cycle-marker-screen",
  title: "Urea Cycle Marker Screen",
  description:
    "Cross-check urea-cycle markers against user-selected screening cutoffs.",
  inputs: [
    { id: "arginine", kind: "number", label: "Arginine" },
    { id: "orotidine", kind: "number", label: "Orotidine" },
    { id: "arginineMinimum", kind: "number", label: "Arginine minimum" },
    { id: "orotidineMaximum", kind: "number", label: "Orotidine maximum" },
  ],
  outputs: [
    { id: "arginineLow", kind: "boolean", label: "Arginine low" },
    { id: "orotidineHigh", kind: "boolean", label: "Orotidine high" },
    { id: "crossCheckFlag", kind: "boolean", label: "Cross check flag" },
  ],
  calculate: (value) =>
    calculate({
      arginine: value.arginine as number,
      orotidine: value.orotidine as number,
      arginineMinimum: value.arginineMinimum as number,
      orotidineMaximum: value.orotidineMaximum as number,
    }),
});
export const run = tool.execute;
export default tool;
