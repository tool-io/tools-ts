import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly neutralMassDa: number;
  readonly precursorMz: number;
  readonly protonMassDa: number;
  readonly maximumCharge: number;
  readonly chargeTolerance: number;
}>;
export type Output = Readonly<{
  readonly estimatedCharge: number;
  readonly predictedMz: number;
  readonly withinTolerance: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.neutralMassDa <= 0 ||
    input.precursorMz <= input.protonMassDa ||
    !Number.isSafeInteger(input.maximumCharge) ||
    input.maximumCharge < 1 ||
    input.chargeTolerance < 0
  )
    simpleError(
      "precursorMz",
      "Valid precursor m/z, mass, and charge range required.",
    );
  let estimatedCharge = 1;
  for (let z = 2; z <= input.maximumCharge; z++)
    if (
      Math.abs(
        input.neutralMassDa / z + input.protonMassDa - input.precursorMz,
      ) <
      Math.abs(
        input.neutralMassDa / estimatedCharge +
          input.protonMassDa -
          input.precursorMz,
      )
    )
      estimatedCharge = z;
  const predictedMz =
    input.neutralMassDa / estimatedCharge + input.protonMassDa;
  return {
    estimatedCharge,
    predictedMz,
    withinTolerance:
      Math.abs(predictedMz - input.precursorMz) <= input.chargeTolerance,
  };
};
export const exampleInput = {
  neutralMassDa: 1000,
  precursorMz: 501,
  protonMassDa: 1,
  maximumCharge: 5,
  chargeTolerance: 0.01,
} satisfies Input;
export const exampleOutput = {
  estimatedCharge: 2,
  predictedMz: 501,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/charge-from-precursor-mz",
  title: "Charge From Precursor MZ",
  description:
    "Infer integer peptide precursor charge from neutral mass and observed m/z.",
  inputs: [
    { id: "neutralMassDa", label: "Neutral mass da", kind: "number" },
    { id: "precursorMz", label: "Precursor mz", kind: "number" },
    { id: "protonMassDa", label: "Proton mass da", kind: "number" },
    { id: "maximumCharge", label: "Maximum charge", kind: "number" },
    { id: "chargeTolerance", label: "Charge tolerance", kind: "number" },
  ],
  outputs: [
    { id: "estimatedCharge", label: "Estimated charge", kind: "number" },
    { id: "predictedMz", label: "Predicted mz", kind: "number" },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      neutralMassDa: value.neutralMassDa as number,
      precursorMz: value.precursorMz as number,
      protonMassDa: value.protonMassDa as number,
      maximumCharge: value.maximumCharge as number,
      chargeTolerance: value.chargeTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
