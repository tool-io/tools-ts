import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly airReadingGrams: number;
  readonly immersedReadingGrams: number;
  readonly airSuspensionTareGrams: number;
  readonly immersedSuspensionTareGrams: number;
  readonly immersionLiquidDensityGramsPerCm3: number;
  readonly referenceWaterDensityGramsPerCm3: number;
}>;
export type Output = Readonly<{
  readonly correctedAirMassGrams: number;
  readonly correctedApparentImmersedMassGrams: number;
  readonly hydrostaticSpecificGravity: number;
  readonly estimatedDensityGramsPerCm3: number;
}>;
const inputFields = [
  { id: "airReadingGrams", label: "Air reading grams", kind: "number" },
  {
    id: "immersedReadingGrams",
    label: "Immersed reading grams",
    kind: "number",
  },
  {
    id: "airSuspensionTareGrams",
    label: "Air suspension tare grams",
    kind: "number",
  },
  {
    id: "immersedSuspensionTareGrams",
    label: "Immersed suspension tare grams",
    kind: "number",
  },
  {
    id: "immersionLiquidDensityGramsPerCm3",
    label: "Immersion liquid density grams per cm3",
    kind: "number",
  },
  {
    id: "referenceWaterDensityGramsPerCm3",
    label: "Reference water density grams per cm3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceWaterDensityGramsPerCm3, "referenceWaterDensity");
  positive(
    input.immersionLiquidDensityGramsPerCm3,
    "immersionLiquidDensityGramsPerCm3",
  );
  const correctedAirMassGrams = positive(
      input.airReadingGrams - input.airSuspensionTareGrams,
      "airMass",
    ),
    correctedApparentImmersedMassGrams =
      input.immersedReadingGrams - input.immersedSuspensionTareGrams,
    loss = positive(
      correctedAirMassGrams - correctedApparentImmersedMassGrams,
      "buoyantLoss",
    ),
    hydrostaticSpecificGravity =
      ((correctedAirMassGrams / loss) *
        input.immersionLiquidDensityGramsPerCm3) /
      input.referenceWaterDensityGramsPerCm3;
  return {
    correctedAirMassGrams,
    correctedApparentImmersedMassGrams,
    hydrostaticSpecificGravity,
    estimatedDensityGramsPerCm3:
      hydrostaticSpecificGravity * input.referenceWaterDensityGramsPerCm3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  airReadingGrams: 10,
  immersedReadingGrams: 7.5,
  airSuspensionTareGrams: 0,
  immersedSuspensionTareGrams: 0,
  immersionLiquidDensityGramsPerCm3: 1,
  referenceWaterDensityGramsPerCm3: 1,
} satisfies Input;
export const exampleOutput = {
  correctedAirMassGrams: 10,
  correctedApparentImmersedMassGrams: 7.5,
  hydrostaticSpecificGravity: 4,
  estimatedDensityGramsPerCm3: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/specific-gravity-hydrostatic",
  title: "Specific Gravity Hydrostatic",
  description:
    "Correct separate air/immersed suspension tares before hydrostatic density and SG relative to declared water reference, retaining negative apparent immersed readings for floating materials; neglects air buoyancy, pores and bubbles and does not identify a gemstone.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedAirMassGrams",
      label: "Corrected air mass grams",
      kind: "number",
    },
    {
      id: "correctedApparentImmersedMassGrams",
      label: "Corrected apparent immersed mass grams",
      kind: "number",
    },
    {
      id: "hydrostaticSpecificGravity",
      label: "Hydrostatic specific gravity",
      kind: "number",
    },
    {
      id: "estimatedDensityGramsPerCm3",
      label: "Estimated density grams per cm3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      airReadingGrams: value.airReadingGrams as number,
      immersedReadingGrams: value.immersedReadingGrams as number,
      airSuspensionTareGrams: value.airSuspensionTareGrams as number,
      immersedSuspensionTareGrams: value.immersedSuspensionTareGrams as number,
      immersionLiquidDensityGramsPerCm3:
        value.immersionLiquidDensityGramsPerCm3 as number,
      referenceWaterDensityGramsPerCm3:
        value.referenceWaterDensityGramsPerCm3 as number,
    }),
});
export const run = tool.execute;
export default tool;
