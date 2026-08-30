import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly neutralMassDa: number;
  readonly adductMassShiftDa: number;
  readonly chargeMagnitude: number;
}>;
export type Output = Readonly<{
  readonly ionMz: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.neutralMassDa <= 0 ||
    !Number.isSafeInteger(input.chargeMagnitude) ||
    input.chargeMagnitude <= 0
  )
    simpleError(
      "chargeMagnitude",
      "Neutral mass and integer nonzero charge magnitude required.",
    );
  return {
    ionMz:
      (input.neutralMassDa + input.adductMassShiftDa) / input.chargeMagnitude,
  };
};
export const exampleInput = {
  neutralMassDa: 100,
  adductMassShiftDa: 1,
  chargeMagnitude: 1,
} satisfies Input;
export const exampleOutput = { ionMz: 101 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/adduct-mz",
  title: "Adduct MZ",
  description:
    "Calculate adduct ion m/z from neutral mass, injected mass shift, and charge.",
  inputs: [
    { id: "neutralMassDa", kind: "number", label: "Neutral mass da" },
    { id: "adductMassShiftDa", kind: "number", label: "Adduct mass shift da" },
    { id: "chargeMagnitude", kind: "number", label: "Charge magnitude" },
  ],
  outputs: [{ id: "ionMz", kind: "number", label: "Ion mz" }],
  calculate: (value) =>
    calculate({
      neutralMassDa: value.neutralMassDa as number,
      adductMassShiftDa: value.adductMassShiftDa as number,
      chargeMagnitude: value.chargeMagnitude as number,
    }),
});
export const run = tool.execute;
export default tool;
