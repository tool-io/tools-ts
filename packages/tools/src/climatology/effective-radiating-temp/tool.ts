import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly solarConstantWPerM2: number;
  readonly planetaryAlbedo: number;
  readonly thermalEmissivity: number;
  readonly stefanBoltzmannWPerM2K4: number;
}>;
export type Output = Readonly<{
  readonly effectiveRadiatingTemperatureK: number;
  readonly globalMeanAbsorbedSolarWPerM2: number;
}>;
const inputFields = [
  {
    id: "solarConstantWPerM2",
    label: "Solar constant w per m2",
    kind: "number",
  },
  { id: "planetaryAlbedo", label: "Planetary albedo", kind: "number" },
  { id: "thermalEmissivity", label: "Thermal emissivity", kind: "number" },
  {
    id: "stefanBoltzmannWPerM2K4",
    label: "Stefan boltzmann w per m2 k4",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.solarConstantWPerM2, "solarConstantWPerM2");
  positive(input.thermalEmissivity, "thermalEmissivity");
  positive(input.stefanBoltzmannWPerM2K4, "stefanBoltzmannWPerM2K4");
  fraction(input.planetaryAlbedo, "planetaryAlbedo");
  fraction(input.thermalEmissivity, "thermalEmissivity");
  const globalMeanAbsorbedSolarWPerM2 =
    (input.solarConstantWPerM2 * (1 - input.planetaryAlbedo)) / 4;
  return {
    effectiveRadiatingTemperatureK:
      (globalMeanAbsorbedSolarWPerM2 /
        (input.thermalEmissivity * input.stefanBoltzmannWPerM2K4)) **
      0.25,
    globalMeanAbsorbedSolarWPerM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  solarConstantWPerM2: 1360,
  planetaryAlbedo: 0.3,
  thermalEmissivity: 1,
  stefanBoltzmannWPerM2K4: 5.670374419e-8,
} satisfies Input;
export const exampleOutput = {
  effectiveRadiatingTemperatureK: 254.5313641586735,
  globalMeanAbsorbedSolarWPerM2: 238,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/effective-radiating-temp",
  title: "Effective Radiating Temperature",
  description:
    "Invert a spherical mean absorbed-solar equilibrium to effective radiating temperature with caller emissivity/Stefan constant; not actual surface temperature or existing forward thermal-flux calculation.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveRadiatingTemperatureK",
      label: "Effective radiating temperature k",
      kind: "number",
    },
    {
      id: "globalMeanAbsorbedSolarWPerM2",
      label: "Global mean absorbed solar w per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      solarConstantWPerM2: value.solarConstantWPerM2 as number,
      planetaryAlbedo: value.planetaryAlbedo as number,
      thermalEmissivity: value.thermalEmissivity as number,
      stefanBoltzmannWPerM2K4: value.stefanBoltzmannWPerM2K4 as number,
    }),
});
export const run = tool.execute;
export default tool;
