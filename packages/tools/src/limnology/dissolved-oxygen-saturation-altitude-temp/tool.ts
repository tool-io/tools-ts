import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly waterTemperatureC: number;
  readonly measuredStationPressureKpa: number;
}>;
export type Output = Readonly<{
  readonly approxFreshwaterOxygenSaturationMgLiter: number;
  readonly approxWaterVaporPressureKpa: number;
}>;
const inputFields = [
  { id: "waterTemperatureC", label: "Water temperature c", kind: "number" },
  {
    id: "measuredStationPressureKpa",
    label: "Measured station pressure kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredStationPressureKpa, "measuredStationPressureKpa");
  if (
    input.waterTemperatureC < 0 ||
    input.waterTemperatureC > 30 ||
    input.measuredStationPressureKpa > 110
  )
    simpleError(
      "domain",
      "Freshwater cubic approximation limited to 0–30 C and station pressure ≤110 kPa.",
    );
  const T = input.waterTemperatureC,
    vapor = 0.61078 * Math.exp((17.2694 * T) / (T + 237.29));
  if (input.measuredStationPressureKpa <= vapor)
    simpleError(
      "pressure",
      "Station pressure must exceed water vapor pressure.",
    );
  const standard =
    14.621 - 0.41022 * T + 0.007991 * T * T - 0.000077774 * T ** 3;
  return {
    approxFreshwaterOxygenSaturationMgLiter:
      (standard * (input.measuredStationPressureKpa - vapor)) /
      (101.325 - vapor),
    approxWaterVaporPressureKpa: vapor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waterTemperatureC: 20,
  measuredStationPressureKpa: 90,
} satisfies Input;
export const exampleOutput = {
  approxFreshwaterOxygenSaturationMgLiter: 7.962176720345409,
  approxWaterVaporPressureKpa: 2.3382176476385186,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/dissolved-oxygen-saturation-altitude-temp",
  title: "Dissolved Oxygen Saturation Altitude Temp Calculator",
  description:
    "Approximate pure-freshwater oxygen saturation using bounded temperature cubic and dry-air station-pressure ratio; caller supplies actual pressure already altitude-resolved, not geodesy, exact standard solubility, salinity correction or observed deficit.",
  inputs: inputFields,
  outputs: [
    {
      id: "approxFreshwaterOxygenSaturationMgLiter",
      label: "Approx freshwater oxygen saturation mg liter",
      kind: "number",
    },
    {
      id: "approxWaterVaporPressureKpa",
      label: "Approx water vapor pressure kpa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      waterTemperatureC: value.waterTemperatureC as number,
      measuredStationPressureKpa: value.measuredStationPressureKpa as number,
    }),
});
export const run = tool.execute;
export default tool;
