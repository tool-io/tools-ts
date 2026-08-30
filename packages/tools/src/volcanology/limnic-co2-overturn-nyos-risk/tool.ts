import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly dissolvedCo2MolPerM3: number;
  readonly henryMolPerM3Pa: number;
  readonly waterDepthM: number;
  readonly waterDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly surfacePressurePa: number;
  readonly otherGasEquivalentPressurePa: number;
}>;
export type Output = Readonly<{
  readonly totalEquivalentGasPressurePa: number;
  readonly ambientAbsolutePressurePa: number;
  readonly gasSupersaturationPressurePa: number;
  readonly aboveEquilibriumGasPressure: boolean;
}>;
const inputFields = [
  {
    id: "dissolvedCo2MolPerM3",
    label: "Dissolved co2 mol per m3",
    kind: "number",
  },
  { id: "henryMolPerM3Pa", label: "Henry mol per m3 pa", kind: "number" },
  { id: "waterDepthM", label: "Water depth m", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "surfacePressurePa", label: "Surface pressure pa", kind: "number" },
  {
    id: "otherGasEquivalentPressurePa",
    label: "Other gas equivalent pressure pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.henryMolPerM3Pa, "henryMolPerM3Pa");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.surfacePressurePa, "surfacePressurePa");
  nonnegative(input.dissolvedCo2MolPerM3, "dissolvedCo2MolPerM3");
  nonnegative(input.waterDepthM, "waterDepthM");
  nonnegative(
    input.otherGasEquivalentPressurePa,
    "otherGasEquivalentPressurePa",
  );
  const totalEquivalentGasPressurePa =
      input.dissolvedCo2MolPerM3 / input.henryMolPerM3Pa +
      input.otherGasEquivalentPressurePa,
    ambientAbsolutePressurePa =
      input.surfacePressurePa +
      input.waterDensityKgPerM3 *
        input.gravityMPerSecondSquared *
        input.waterDepthM,
    gasSupersaturationPressurePa =
      totalEquivalentGasPressurePa - ambientAbsolutePressurePa;
  return {
    totalEquivalentGasPressurePa,
    ambientAbsolutePressurePa,
    gasSupersaturationPressurePa,
    aboveEquilibriumGasPressure: gasSupersaturationPressurePa > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dissolvedCo2MolPerM3: 10,
  henryMolPerM3Pa: 0.0001,
  waterDepthM: 1,
  waterDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
  surfacePressurePa: 100000,
  otherGasEquivalentPressurePa: 20000,
} satisfies Input;
export const exampleOutput = {
  totalEquivalentGasPressurePa: 120000,
  ambientAbsolutePressurePa: 110000,
  gasSupersaturationPressurePa: 10000,
  aboveEquilibriumGasPressure: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/limnic-co2-overturn-nyos-risk",
  title: "Limnic CO2 Overturn Nyos Risk Checker",
  description:
    "Compare total caller Henry-equivalent gas pressure to local absolute hydrostatic confinement; this equilibrium supersaturation screen cannot establish lake overturn, nucleation, eruption probability or safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalEquivalentGasPressurePa",
      label: "Total equivalent gas pressure pa",
      kind: "number",
    },
    {
      id: "ambientAbsolutePressurePa",
      label: "Ambient absolute pressure pa",
      kind: "number",
    },
    {
      id: "gasSupersaturationPressurePa",
      label: "Gas supersaturation pressure pa",
      kind: "number",
    },
    {
      id: "aboveEquilibriumGasPressure",
      label: "Above equilibrium gas pressure",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      dissolvedCo2MolPerM3: value.dissolvedCo2MolPerM3 as number,
      henryMolPerM3Pa: value.henryMolPerM3Pa as number,
      waterDepthM: value.waterDepthM as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      surfacePressurePa: value.surfacePressurePa as number,
      otherGasEquivalentPressurePa:
        value.otherGasEquivalentPressurePa as number,
    }),
});
export const run = tool.execute;
export default tool;
