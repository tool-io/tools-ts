import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialIceThicknessM: number;
  readonly snowThermalResistanceM2KPerW: number;
  readonly iceConductivityWPerMK: number;
  readonly iceDensityKgPerM3: number;
  readonly latentHeatJPerKg: number;
  readonly freezingDegreeDays: number;
  readonly secondsPerDay: number;
}>;
export type Output = Readonly<{ readonly predictedIceThicknessM: number }>;
const inputFields = [
  {
    id: "initialIceThicknessM",
    label: "Initial ice thickness m",
    kind: "number",
  },
  {
    id: "snowThermalResistanceM2KPerW",
    label: "Snow thermal resistance m2 k per w",
    kind: "number",
  },
  {
    id: "iceConductivityWPerMK",
    label: "Ice conductivity w per m k",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  { id: "latentHeatJPerKg", label: "Latent heat j per kg", kind: "number" },
  { id: "freezingDegreeDays", label: "Freezing degree days", kind: "number" },
  { id: "secondsPerDay", label: "Seconds per day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceConductivityWPerMK, "iceConductivityWPerMK");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.latentHeatJPerKg, "latentHeatJPerKg");
  positive(input.secondsPerDay, "secondsPerDay");
  nonnegative(input.initialIceThicknessM, "initialIceThicknessM");
  nonnegative(
    input.snowThermalResistanceM2KPerW,
    "snowThermalResistanceM2KPerW",
  );
  nonnegative(input.freezingDegreeDays, "freezingDegreeDays");
  const r = input.iceConductivityWPerMK * input.snowThermalResistanceM2KPerW,
    forcing =
      (2 *
        input.iceConductivityWPerMK *
        input.freezingDegreeDays *
        input.secondsPerDay) /
      (input.iceDensityKgPerM3 * input.latentHeatJPerKg),
    base = input.initialIceThicknessM + r;
  return {
    predictedIceThicknessM:
      input.initialIceThicknessM +
      (forcing === 0 ? 0 : forcing / (Math.sqrt(base * base + forcing) + base)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialIceThicknessM: 0.1,
  snowThermalResistanceM2KPerW: 0.1,
  iceConductivityWPerMK: 2,
  iceDensityKgPerM3: 900,
  latentHeatJPerKg: 300000,
  freezingDegreeDays: 10,
  secondsPerDay: 86400,
} satisfies Input;
export const exampleOutput = {
  predictedIceThicknessM: 0.12062439083762794,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/ice-thickness-stefan-law",
  title: "Ice Thickness Stefan Law",
  description:
    "Integrate a Stefan conductive growth model with fixed snow thermal resistance and initial ice; excludes melting, flowing water, radiation and evolving snowpack.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedIceThicknessM",
      label: "Predicted ice thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialIceThicknessM: value.initialIceThicknessM as number,
      snowThermalResistanceM2KPerW:
        value.snowThermalResistanceM2KPerW as number,
      iceConductivityWPerMK: value.iceConductivityWPerMK as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      latentHeatJPerKg: value.latentHeatJPerKg as number,
      freezingDegreeDays: value.freezingDegreeDays as number,
      secondsPerDay: value.secondsPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
