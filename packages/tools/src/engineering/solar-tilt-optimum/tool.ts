import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  extrema,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedTestedSolarTiltsDegrees: readonly number[];
  readonly observedMatchedHarvestedKwh: readonly number[];
}>;
export type Output = Readonly<{
  readonly bestObservedSolarTiltsDegrees: readonly number[];
  readonly maximumObservedKwh: number;
}>;
const inputFields = [
  {
    id: "observedTestedSolarTiltsDegrees",
    label: "Observed tested solar tilts degrees",
    kind: "numberList",
  },
  {
    id: "observedMatchedHarvestedKwh",
    label: "Observed matched harvested kwh",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedHarvestedKwh.forEach((v) =>
    nonnegative(v, "observedMatchedHarvestedKwh"),
  );
  if (input.observedTestedSolarTiltsDegrees.some((v) => v < 0 || v > 90))
    simpleError("tilt", "Observed panel tilt0–90deg.");
  const e = extrema(
    input.observedTestedSolarTiltsDegrees,
    input.observedMatchedHarvestedKwh,
    true,
  );
  return {
    bestObservedSolarTiltsDegrees: e.coordinates,
    maximumObservedKwh: e.value,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTestedSolarTiltsDegrees: [0, 20, 40],
  observedMatchedHarvestedKwh: [10, 20, 20],
} satisfies Input;
export const exampleOutput = {
  bestObservedSolarTiltsDegrees: [20, 40],
  maximumObservedKwh: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/solar-tilt-optimum",
  title: "Solar Tilt Optimum Calculator",
  description:
    "Select tied best actual controlled tilt trials, no latitude-based heuristic, seasonal extrapolation or geographic transformation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "bestObservedSolarTiltsDegrees",
      label: "Best observed solar tilts degrees",
      kind: "numberList",
    },
    { id: "maximumObservedKwh", label: "Maximum observed kwh", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedTestedSolarTiltsDegrees:
        value.observedTestedSolarTiltsDegrees as readonly number[],
      observedMatchedHarvestedKwh:
        value.observedMatchedHarvestedKwh as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
