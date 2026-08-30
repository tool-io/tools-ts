import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly atp: number;
  readonly adp: number;
  readonly amp: number;
}>;
export type Output = Readonly<{
  readonly energyCharge: number;
  readonly totalAdenylates: number;
}>;
export const calculate = (input: Input): Output => {
  if (Math.min(input.atp, input.adp, input.amp) < 0)
    simpleError("atp", "Adenylate abundances must be nonnegative.");
  const totalAdenylates = input.atp + input.adp + input.amp;
  if (totalAdenylates <= 0)
    simpleError("atp", "Total adenylates must be positive.");
  return {
    energyCharge: (input.atp + 0.5 * input.adp) / totalAdenylates,
    totalAdenylates,
  };
};
export const exampleInput = { atp: 2, adp: 2, amp: 2 } satisfies Input;
export const exampleOutput = {
  energyCharge: 0.5,
  totalAdenylates: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/adenylate-energy-charge",
  title: "Adenylate Energy Charge",
  description: "Calculate adenylate energy charge from ATP, ADP, and AMP.",
  inputs: [
    { id: "atp", kind: "number", label: "Atp" },
    { id: "adp", kind: "number", label: "Adp" },
    { id: "amp", kind: "number", label: "Amp" },
  ],
  outputs: [
    { id: "energyCharge", kind: "number", label: "Energy charge" },
    { id: "totalAdenylates", kind: "number", label: "Total adenylates" },
  ],
  calculate: (value) =>
    calculate({
      atp: value.atp as number,
      adp: value.adp as number,
      amp: value.amp as number,
    }),
});
export const run = tool.execute;
export default tool;
