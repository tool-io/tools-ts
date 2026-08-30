import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly titratedAcidityCmolChargePerKg: number;
  readonly soilBulkDensityKgPerM3: number;
  readonly treatmentDepthM: number;
  readonly neutralizingGramsCaCO3PerMolCharge: number;
  readonly productNeutralizingValueFraction: number;
  readonly fieldReactionEffectivenessFraction: number;
}>;
export type Output = Readonly<{
  readonly titratedPureCaCO3EquivalentTonnesPerHa: number;
  readonly modelLimeProductTonnesPerHa: number;
}>;
const inputFields = [
  {
    id: "titratedAcidityCmolChargePerKg",
    label: "Titrated acidity cmol charge per kg",
    kind: "number",
  },
  {
    id: "soilBulkDensityKgPerM3",
    label: "Soil bulk density kg per m3",
    kind: "number",
  },
  { id: "treatmentDepthM", label: "Treatment depth m", kind: "number" },
  {
    id: "neutralizingGramsCaCO3PerMolCharge",
    label: "Neutralizing grams ca c o3 per mol charge",
    kind: "number",
  },
  {
    id: "productNeutralizingValueFraction",
    label: "Product neutralizing value fraction",
    kind: "number",
  },
  {
    id: "fieldReactionEffectivenessFraction",
    label: "Field reaction effectiveness fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.soilBulkDensityKgPerM3, "soilBulkDensityKgPerM3");
  positive(input.treatmentDepthM, "treatmentDepthM");
  positive(
    input.neutralizingGramsCaCO3PerMolCharge,
    "neutralizingGramsCaCO3PerMolCharge",
  );
  positive(
    input.productNeutralizingValueFraction,
    "productNeutralizingValueFraction",
  );
  positive(
    input.fieldReactionEffectivenessFraction,
    "fieldReactionEffectivenessFraction",
  );
  nonnegative(
    input.titratedAcidityCmolChargePerKg,
    "titratedAcidityCmolChargePerKg",
  );
  fraction(
    input.productNeutralizingValueFraction,
    "productNeutralizingValueFraction",
  );
  fraction(
    input.fieldReactionEffectivenessFraction,
    "fieldReactionEffectivenessFraction",
  );
  const soilMass = input.soilBulkDensityKgPerM3 * input.treatmentDepthM * 10000,
    titratedPureCaCO3EquivalentTonnesPerHa =
      (input.titratedAcidityCmolChargePerKg *
        0.01 *
        soilMass *
        input.neutralizingGramsCaCO3PerMolCharge) /
      1e6;
  return {
    titratedPureCaCO3EquivalentTonnesPerHa,
    modelLimeProductTonnesPerHa:
      titratedPureCaCO3EquivalentTonnesPerHa /
      (input.productNeutralizingValueFraction *
        input.fieldReactionEffectivenessFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  titratedAcidityCmolChargePerKg: 2,
  soilBulkDensityKgPerM3: 1000,
  treatmentDepthM: 0.1,
  neutralizingGramsCaCO3PerMolCharge: 50,
  productNeutralizingValueFraction: 0.8,
  fieldReactionEffectivenessFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  titratedPureCaCO3EquivalentTonnesPerHa: 1,
  modelLimeProductTonnesPerHa: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/lime-requirement",
  title: "Agriculture Lime Requirement",
  description:
    "Convert independently titrated soil acidity to a caller CaCO3-equivalent/product mass under depth/density/neutralization/effectiveness assumptions; does not choose target pH, titration endpoint or a field dose recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "titratedPureCaCO3EquivalentTonnesPerHa",
      label: "Titrated pure ca c o3 equivalent tonnes per ha",
      kind: "number",
    },
    {
      id: "modelLimeProductTonnesPerHa",
      label: "Model lime product tonnes per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      titratedAcidityCmolChargePerKg:
        value.titratedAcidityCmolChargePerKg as number,
      soilBulkDensityKgPerM3: value.soilBulkDensityKgPerM3 as number,
      treatmentDepthM: value.treatmentDepthM as number,
      neutralizingGramsCaCO3PerMolCharge:
        value.neutralizingGramsCaCO3PerMolCharge as number,
      productNeutralizingValueFraction:
        value.productNeutralizingValueFraction as number,
      fieldReactionEffectivenessFraction:
        value.fieldReactionEffectivenessFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
