import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly dryPumiceBulkDensityKgPerM3: number;
  readonly waterDensityKgPerM3: number;
  readonly connectedPoreVolumeFraction: number;
  readonly waterFilledConnectedPoreFraction: number;
}>;
export type Output = Readonly<{
  readonly wettedBulkDensityKgPerM3: number;
  readonly modelWaterFillFractionAtNeutralBuoyancy: number;
  readonly positiveBuoyancyUnderModel: boolean;
}>;
const inputFields = [
  {
    id: "dryPumiceBulkDensityKgPerM3",
    label: "Dry pumice bulk density kg per m3",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "connectedPoreVolumeFraction",
    label: "Connected pore volume fraction",
    kind: "number",
  },
  {
    id: "waterFilledConnectedPoreFraction",
    label: "Water filled connected pore fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.dryPumiceBulkDensityKgPerM3, "dryPumiceBulkDensityKgPerM3");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.connectedPoreVolumeFraction, "connectedPoreVolumeFraction");
  fraction(input.connectedPoreVolumeFraction, "connectedPoreVolumeFraction");
  fraction(
    input.waterFilledConnectedPoreFraction,
    "waterFilledConnectedPoreFraction",
  );
  const wettedBulkDensityKgPerM3 =
    input.dryPumiceBulkDensityKgPerM3 +
    input.waterDensityKgPerM3 *
      input.connectedPoreVolumeFraction *
      input.waterFilledConnectedPoreFraction;
  return {
    wettedBulkDensityKgPerM3,
    modelWaterFillFractionAtNeutralBuoyancy:
      (input.waterDensityKgPerM3 - input.dryPumiceBulkDensityKgPerM3) /
      (input.waterDensityKgPerM3 * input.connectedPoreVolumeFraction),
    positiveBuoyancyUnderModel:
      wettedBulkDensityKgPerM3 < input.waterDensityKgPerM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dryPumiceBulkDensityKgPerM3: 500,
  waterDensityKgPerM3: 1000,
  connectedPoreVolumeFraction: 0.6,
  waterFilledConnectedPoreFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  wettedBulkDensityKgPerM3: 800,
  modelWaterFillFractionAtNeutralBuoyancy: 0.8333333333333334,
  positiveBuoyancyUnderModel: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/pumice-density-floating-checker",
  title: "Pumice Density Floating Checker",
  description:
    "Model pore-water uptake at fixed pumice envelope volume and report a signed neutral-buoyancy fill fraction; values outside [0,1] identify unreachable thresholds, not an invented flotation guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "wettedBulkDensityKgPerM3",
      label: "Wetted bulk density kg per m3",
      kind: "number",
    },
    {
      id: "modelWaterFillFractionAtNeutralBuoyancy",
      label: "Model water fill fraction at neutral buoyancy",
      kind: "number",
    },
    {
      id: "positiveBuoyancyUnderModel",
      label: "Positive buoyancy under model",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      dryPumiceBulkDensityKgPerM3: value.dryPumiceBulkDensityKgPerM3 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      connectedPoreVolumeFraction: value.connectedPoreVolumeFraction as number,
      waterFilledConnectedPoreFraction:
        value.waterFilledConnectedPoreFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
