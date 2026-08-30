import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly netRadiationWattsPerM2: number;
  readonly storageHeatGainWattsPerM2: number;
  readonly netAdvectedHeatWattsPerM2: number;
  readonly bowenRatio: number;
  readonly waterDensityKgPerM3: number;
  readonly latentHeatJPerKg: number;
  readonly secondsPerDay: number;
}>;
export type Output = Readonly<{
  readonly signedLatentHeatFluxWattsPerM2: number;
  readonly signedEvaporationMmPerDay: number;
}>;
const inputFields = [
  {
    id: "netRadiationWattsPerM2",
    label: "Net radiation watts per m2",
    kind: "number",
  },
  {
    id: "storageHeatGainWattsPerM2",
    label: "Storage heat gain watts per m2",
    kind: "number",
  },
  {
    id: "netAdvectedHeatWattsPerM2",
    label: "Net advected heat watts per m2",
    kind: "number",
  },
  { id: "bowenRatio", label: "Bowen ratio", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  { id: "latentHeatJPerKg", label: "Latent heat j per kg", kind: "number" },
  { id: "secondsPerDay", label: "Seconds per day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.latentHeatJPerKg, "latentHeatJPerKg");
  positive(input.secondsPerDay, "secondsPerDay");
  if (input.bowenRatio <= -1)
    simpleError(
      "bowenRatio",
      "Bowen ratio above −1 required for finite available-energy partition.",
    );
  const signedLatentHeatFluxWattsPerM2 =
    (input.netRadiationWattsPerM2 -
      input.storageHeatGainWattsPerM2 +
      input.netAdvectedHeatWattsPerM2) /
    (1 + input.bowenRatio);
  return {
    signedLatentHeatFluxWattsPerM2,
    signedEvaporationMmPerDay:
      (1000 * signedLatentHeatFluxWattsPerM2 * input.secondsPerDay) /
      (input.waterDensityKgPerM3 * input.latentHeatJPerKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  netRadiationWattsPerM2: 100,
  storageHeatGainWattsPerM2: 20,
  netAdvectedHeatWattsPerM2: 10,
  bowenRatio: 0.5,
  waterDensityKgPerM3: 1000,
  latentHeatJPerKg: 2400000,
  secondsPerDay: 86400,
} satisfies Input;
export const exampleOutput = {
  signedLatentHeatFluxWattsPerM2: 60,
  signedEvaporationMmPerDay: 2.16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/lake-evaporation-energy-balance-method",
  title: "Lake Evaporation Energy Balance Method",
  description:
    "Estimate signed evaporation by a caller Bowen-ratio available-energy budget including storage/advected heat; negative results indicate condensation-model potential and missing fluxes are not diagnosed.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedLatentHeatFluxWattsPerM2",
      label: "Signed latent heat flux watts per m2",
      kind: "number",
    },
    {
      id: "signedEvaporationMmPerDay",
      label: "Signed evaporation mm per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      netRadiationWattsPerM2: value.netRadiationWattsPerM2 as number,
      storageHeatGainWattsPerM2: value.storageHeatGainWattsPerM2 as number,
      netAdvectedHeatWattsPerM2: value.netAdvectedHeatWattsPerM2 as number,
      bowenRatio: value.bowenRatio as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      latentHeatJPerKg: value.latentHeatJPerKg as number,
      secondsPerDay: value.secondsPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
