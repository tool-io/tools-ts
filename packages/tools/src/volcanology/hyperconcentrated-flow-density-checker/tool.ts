import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly measuredMixtureDensitiesKgPerM3: readonly number[];
  readonly waterDensityKgPerM3: number;
  readonly grainDensityKgPerM3: number;
  readonly callerHyperconcentratedVolumeFractionBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredSolidVolumeFractions: readonly number[];
  readonly withinCallerHyperconcentratedBandFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredMixtureDensitiesKgPerM3",
    label: "Measured mixture densities kg per m3",
    kind: "numberList",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "grainDensityKgPerM3",
    label: "Grain density kg per m3",
    kind: "number",
  },
  {
    id: "callerHyperconcentratedVolumeFractionBounds",
    label: "Caller hyperconcentrated volume fraction bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredMixtureDensitiesKgPerM3.forEach((v) =>
    positive(v, "measuredMixtureDensitiesKgPerM3"),
  );
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.grainDensityKgPerM3, "grainDensityKgPerM3");
  input.callerHyperconcentratedVolumeFractionBounds.forEach((v) =>
    fraction(v, "callerHyperconcentratedVolumeFractionBounds"),
  );
  if (
    input.grainDensityKgPerM3 <= input.waterDensityKgPerM3 ||
    input.callerHyperconcentratedVolumeFractionBounds.length !== 2 ||
    input.callerHyperconcentratedVolumeFractionBounds[0] >
      input.callerHyperconcentratedVolumeFractionBounds[1]
  )
    simpleError(
      "bounds",
      "Denser grains and ordered caller concentration band required.",
    );
  const inferredSolidVolumeFractions =
      input.measuredMixtureDensitiesKgPerM3.map((r) =>
        fraction(
          (r - input.waterDensityKgPerM3) /
            (input.grainDensityKgPerM3 - input.waterDensityKgPerM3),
          "measuredMixtureDensitiesKgPerM3",
        ),
      ),
    [lo, hi] = input.callerHyperconcentratedVolumeFractionBounds;
  return {
    inferredSolidVolumeFractions,
    withinCallerHyperconcentratedBandFlags: inferredSolidVolumeFractions.map(
      (v) => (v >= lo && v <= hi ? 1 : 0),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredMixtureDensitiesKgPerM3: [1000, 1500, 2000],
  waterDensityKgPerM3: 1000,
  grainDensityKgPerM3: 3000,
  callerHyperconcentratedVolumeFractionBounds: [0.2, 0.4],
} satisfies Input;
export const exampleOutput = {
  inferredSolidVolumeFractions: [0, 0.25, 0.5],
  withinCallerHyperconcentratedBandFlags: [0, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/hyperconcentrated-flow-density-checker",
  title: "Hyperconcentrated Flow Density Range Checker",
  description:
    "Screen density-derived solid volume concentrations against a caller hyperconcentrated-flow band; existing mining tools infer pulp mass fraction, not this flow-regime volume policy, and gas-rich mixtures are unsupported.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredSolidVolumeFractions",
      label: "Inferred solid volume fractions",
      kind: "numberList",
    },
    {
      id: "withinCallerHyperconcentratedBandFlags",
      label: "Within caller hyperconcentrated band flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredMixtureDensitiesKgPerM3:
        value.measuredMixtureDensitiesKgPerM3 as readonly number[],
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      grainDensityKgPerM3: value.grainDensityKgPerM3 as number,
      callerHyperconcentratedVolumeFractionBounds:
        value.callerHyperconcentratedVolumeFractionBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
