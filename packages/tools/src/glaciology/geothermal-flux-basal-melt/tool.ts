import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly geothermalFluxWattsPerM2: number;
  readonly conductiveHeatLossWattsPerM2: number;
  readonly iceDensityKgPerM3: number;
  readonly latentHeatJPerKg: number;
  readonly secondsPerYear: number;
}>;
export type Output = Readonly<{
  readonly netBasalHeatFluxWattsPerM2: number;
  readonly signedMeltMetersIcePerYear: number;
}>;
const inputFields = [
  {
    id: "geothermalFluxWattsPerM2",
    label: "Geothermal flux watts per m2",
    kind: "number",
  },
  {
    id: "conductiveHeatLossWattsPerM2",
    label: "Conductive heat loss watts per m2",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  { id: "latentHeatJPerKg", label: "Latent heat j per kg", kind: "number" },
  { id: "secondsPerYear", label: "Seconds per year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.latentHeatJPerKg, "latentHeatJPerKg");
  positive(input.secondsPerYear, "secondsPerYear");
  nonnegative(input.geothermalFluxWattsPerM2, "geothermalFluxWattsPerM2");
  nonnegative(
    input.conductiveHeatLossWattsPerM2,
    "conductiveHeatLossWattsPerM2",
  );
  const netBasalHeatFluxWattsPerM2 =
    input.geothermalFluxWattsPerM2 - input.conductiveHeatLossWattsPerM2;
  return {
    netBasalHeatFluxWattsPerM2,
    signedMeltMetersIcePerYear:
      (netBasalHeatFluxWattsPerM2 * input.secondsPerYear) /
      (input.iceDensityKgPerM3 * input.latentHeatJPerKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  geothermalFluxWattsPerM2: 0.1,
  conductiveHeatLossWattsPerM2: 0.04,
  iceDensityKgPerM3: 900,
  latentHeatJPerKg: 300000,
  secondsPerYear: 30000000,
} satisfies Input;
export const exampleOutput = {
  netBasalHeatFluxWattsPerM2: 0.06,
  signedMeltMetersIcePerYear: 0.006666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/geothermal-flux-basal-melt",
  title: "Geothermal Flux Basal Melt",
  description:
    "Convert net geothermal-minus-conductive basal heat to signed ice melt under pressure-melting conditions; negative flux represents freezing potential, not guaranteed actual freezing.",
  inputs: inputFields,
  outputs: [
    {
      id: "netBasalHeatFluxWattsPerM2",
      label: "Net basal heat flux watts per m2",
      kind: "number",
    },
    {
      id: "signedMeltMetersIcePerYear",
      label: "Signed melt meters ice per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      geothermalFluxWattsPerM2: value.geothermalFluxWattsPerM2 as number,
      conductiveHeatLossWattsPerM2:
        value.conductiveHeatLossWattsPerM2 as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      latentHeatJPerKg: value.latentHeatJPerKg as number,
      secondsPerYear: value.secondsPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
