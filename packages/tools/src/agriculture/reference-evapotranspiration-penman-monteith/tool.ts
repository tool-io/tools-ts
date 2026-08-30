import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly meanAirTemperatureC: number;
  readonly netRadiationMjPerM2Day: number;
  readonly soilHeatFluxMjPerM2Day: number;
  readonly saturationSlopeKpaPerC: number;
  readonly psychrometricConstantKpaPerC: number;
  readonly windAtTwoMetersMPerSecond: number;
  readonly vaporPressureDeficitKpa: number;
}>;
export type Output = Readonly<{
  readonly signedFao56ReferenceEtMmPerDay: number;
}>;
const inputFields = [
  {
    id: "meanAirTemperatureC",
    label: "Mean air temperature c",
    kind: "number",
  },
  {
    id: "netRadiationMjPerM2Day",
    label: "Net radiation mj per m2 day",
    kind: "number",
  },
  {
    id: "soilHeatFluxMjPerM2Day",
    label: "Soil heat flux mj per m2 day",
    kind: "number",
  },
  {
    id: "saturationSlopeKpaPerC",
    label: "Saturation slope kpa per c",
    kind: "number",
  },
  {
    id: "psychrometricConstantKpaPerC",
    label: "Psychrometric constant kpa per c",
    kind: "number",
  },
  {
    id: "windAtTwoMetersMPerSecond",
    label: "Wind at two meters m per second",
    kind: "number",
  },
  {
    id: "vaporPressureDeficitKpa",
    label: "Vapor pressure deficit kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.saturationSlopeKpaPerC, "saturationSlopeKpaPerC");
  positive(input.psychrometricConstantKpaPerC, "psychrometricConstantKpaPerC");
  nonnegative(input.windAtTwoMetersMPerSecond, "windAtTwoMetersMPerSecond");
  nonnegative(input.vaporPressureDeficitKpa, "vaporPressureDeficitKpa");
  const t = positive(input.meanAirTemperatureC + 273, "absoluteTemperature"),
    d = input.saturationSlopeKpaPerC,
    g = input.psychrometricConstantKpaPerC,
    u = input.windAtTwoMetersMPerSecond;
  return {
    signedFao56ReferenceEtMmPerDay:
      (0.408 *
        d *
        (input.netRadiationMjPerM2Day - input.soilHeatFluxMjPerM2Day) +
        ((g * 900) / t) * u * input.vaporPressureDeficitKpa) /
      (d + g * (1 + 0.34 * u)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  meanAirTemperatureC: 27,
  netRadiationMjPerM2Day: 10,
  soilHeatFluxMjPerM2Day: 0,
  saturationSlopeKpaPerC: 0.1,
  psychrometricConstantKpaPerC: 0.05,
  windAtTwoMetersMPerSecond: 2,
  vaporPressureDeficitKpa: 1,
} satisfies Input;
export const exampleOutput = {
  signedFao56ReferenceEtMmPerDay: 3.847826086956521,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/reference-evapotranspiration-penman-monteith",
  title: "Agriculture Reference Evapotranspiration Penman Monteith",
  description:
    "Evaluate named FAO-56 daily grass reference Penman–Monteith with caller radiation, atmospheric coefficients, 2 m wind and VPD; retains signed condensation scenarios, not hourly constants, weather derivation or actual crop ET.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFao56ReferenceEtMmPerDay",
      label: "Signed fao56 reference et mm per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      meanAirTemperatureC: value.meanAirTemperatureC as number,
      netRadiationMjPerM2Day: value.netRadiationMjPerM2Day as number,
      soilHeatFluxMjPerM2Day: value.soilHeatFluxMjPerM2Day as number,
      saturationSlopeKpaPerC: value.saturationSlopeKpaPerC as number,
      psychrometricConstantKpaPerC:
        value.psychrometricConstantKpaPerC as number,
      windAtTwoMetersMPerSecond: value.windAtTwoMetersMPerSecond as number,
      vaporPressureDeficitKpa: value.vaporPressureDeficitKpa as number,
    }),
});
export const run = tool.execute;
export default tool;
