import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly variantPositionBp: number;
  readonly cpgPositionBp: number;
  readonly cisWindowBp: number;
}>;
export type Output = Readonly<{
  readonly distanceBp: number;
  readonly withinCisWindow: boolean;
}>;

export const calculate = (input: Input): Output => {
  const distanceBp = Math.abs(input.variantPositionBp - input.cpgPositionBp);
  return { distanceBp, withinCisWindow: distanceBp <= input.cisWindowBp };
};

export const exampleInput = {
  variantPositionBp: 1000,
  cpgPositionBp: 1300,
  cisWindowBp: 500,
} satisfies Input;
export const exampleOutput = {
  distanceBp: 300,
  withinCisWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      variantPositionBp: input.variantPositionBp as number,
      cpgPositionBp: input.cpgPositionBp as number,
      cisWindowBp: input.cisWindowBp as number,
    }),
  description: "Check variant-CpG distance against a supplied cis window.",
  id: "epigenetics/meqtl-cis-window",
  inputs: [
    {
      id: "variantPositionBp",
      label: "Variant position",
      kind: "number",
      minimum: 0,
    },
    { id: "cpgPositionBp", label: "CpG position", kind: "number", minimum: 0 },
    {
      id: "cisWindowBp",
      label: "Cis-window radius",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "distanceBp",
      label: "Variant-CpG distance",
      kind: "number",
      minimum: 0,
    },
    { id: "withinCisWindow", label: "Within cis window", kind: "boolean" },
  ],
  title: "meQTL Cis-Window",
});

export const run = tool.execute;
export default tool;
