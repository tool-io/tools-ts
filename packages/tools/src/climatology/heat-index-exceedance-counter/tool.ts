import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
} from "../shared.js";

export type Input = Readonly<{
  readonly observedTemperaturesC: readonly number[];
  readonly relativeHumidityFractions: readonly number[];
  readonly representedHours: readonly number[];
  readonly callerHeatIndexThresholdC: number;
}>;
export type Output = Readonly<{
  readonly rothfuszHeatIndicesC: readonly number[];
  readonly hoursAboveCallerThreshold: number;
  readonly exposureFractionAboveCallerThreshold: number;
}>;
const inputFields = [
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  {
    id: "relativeHumidityFractions",
    label: "Relative humidity fractions",
    kind: "numberList",
  },
  { id: "representedHours", label: "Represented hours", kind: "numberList" },
  {
    id: "callerHeatIndexThresholdC",
    label: "Caller heat index threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedHours.forEach((v) => positive(v, "representedHours"));
  input.relativeHumidityFractions.forEach((v) =>
    fraction(v, "relativeHumidityFractions"),
  );
  aligned(
    input.observedTemperaturesC,
    input.relativeHumidityFractions,
    "observedTemperaturesC",
  );
  aligned(
    input.observedTemperaturesC,
    input.representedHours,
    "observedTemperaturesC",
  );
  const rothfuszHeatIndicesC = input.observedTemperaturesC.map((c, i) => {
    const t = (c * 9) / 5 + 32,
      r = input.relativeHumidityFractions[i] * 100;
    if (t < 80 || t > 120 || r < 40)
      simpleError(
        "domain",
        "Base Rothfusz regression restricted to 80–120 F and RH 40–100%; low-RH corrections are not implemented.",
      );
    const f =
      -42.379 +
      2.04901523 * t +
      10.14333127 * r -
      0.22475541 * t * r -
      0.00683783 * t * t -
      0.05481717 * r * r +
      0.00122874 * t * t * r +
      0.00085282 * t * r * r -
      0.00000199 * t * t * r * r;
    return ((f - 32) * 5) / 9;
  });
  const hoursAboveCallerThreshold = rothfuszHeatIndicesC.reduce(
    (s, v, i) =>
      s + (v > input.callerHeatIndexThresholdC ? input.representedHours[i] : 0),
    0,
  );
  return {
    rothfuszHeatIndicesC,
    hoursAboveCallerThreshold,
    exposureFractionAboveCallerThreshold:
      hoursAboveCallerThreshold /
      input.representedHours.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTemperaturesC: [30, 30],
  relativeHumidityFractions: [0.7, 0.7],
  representedHours: [1, 3],
  callerHeatIndexThresholdC: 35,
} satisfies Input;
export const exampleOutput = {
  rothfuszHeatIndicesC: [35.03801755555546, 35.03801755555546],
  hoursAboveCallerThreshold: 4,
  exposureFractionAboveCallerThreshold: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/heat-index-exceedance-counter",
  title: "Heat Index Climatological Exceedance Counter",
  description:
    "Count exposure above caller heat-index threshold using explicitly domain-restricted Rothfusz base regression, not the existing Steadman apparent-temperature tool; no low-RH adjustment or heat-health/work safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "rothfuszHeatIndicesC",
      label: "Rothfusz heat indices c",
      kind: "numberList",
    },
    {
      id: "hoursAboveCallerThreshold",
      label: "Hours above caller threshold",
      kind: "number",
    },
    {
      id: "exposureFractionAboveCallerThreshold",
      label: "Exposure fraction above caller threshold",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      relativeHumidityFractions:
        value.relativeHumidityFractions as readonly number[],
      representedHours: value.representedHours as readonly number[],
      callerHeatIndexThresholdC: value.callerHeatIndexThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
