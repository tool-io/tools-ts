import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  extrema,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly measuredMoistureFractions: readonly number[];
  readonly measuredDryDensitiesKgM3: readonly number[];
  readonly observedFieldMoistureFraction: number;
}>;
export type Output = Readonly<{
  readonly bestObservedMoistureFractions: readonly number[];
  readonly maximumObservedDryDensityKgM3: number;
  readonly signedFieldMoistureMinusBest: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredMoistureFractions",
    label: "Measured moisture fractions",
    kind: "numberList",
  },
  {
    id: "measuredDryDensitiesKgM3",
    label: "Measured dry densities kg m3",
    kind: "numberList",
  },
  {
    id: "observedFieldMoistureFraction",
    label: "Observed field moisture fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredDryDensitiesKgM3.forEach((v) =>
    positive(v, "measuredDryDensitiesKgM3"),
  );
  input.measuredMoistureFractions.forEach((v) =>
    fraction(v, "measuredMoistureFractions"),
  );
  fraction(
    input.observedFieldMoistureFraction,
    "observedFieldMoistureFraction",
  );
  const e = extrema(
    input.measuredMoistureFractions,
    input.measuredDryDensitiesKgM3,
    true,
  );
  return {
    bestObservedMoistureFractions: e.coordinates,
    maximumObservedDryDensityKgM3: e.value,
    signedFieldMoistureMinusBest: e.coordinates.map(
      (v) => input.observedFieldMoistureFraction - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredMoistureFractions: [0.1, 0.2, 0.3],
  measuredDryDensitiesKgM3: [1000, 1200, 1100],
  observedFieldMoistureFraction: 0.22,
} satisfies Input;
export const exampleOutput = {
  bestObservedMoistureFractions: [0.2],
  maximumObservedDryDensityKgM3: 1200,
  signedFieldMoistureMinusBest: [0.02],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/proctor-optimum-check",
  title: "Proctor Optimum Check",
  description:
    "Extract actual sampled Proctor density maxima/ties, not an assumed interpolated optimum or compaction approval. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "bestObservedMoistureFractions",
      label: "Best observed moisture fractions",
      kind: "numberList",
    },
    {
      id: "maximumObservedDryDensityKgM3",
      label: "Maximum observed dry density kg m3",
      kind: "number",
    },
    {
      id: "signedFieldMoistureMinusBest",
      label: "Signed field moisture minus best",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredMoistureFractions:
        value.measuredMoistureFractions as readonly number[],
      measuredDryDensitiesKgM3:
        value.measuredDryDensitiesKgM3 as readonly number[],
      observedFieldMoistureFraction:
        value.observedFieldMoistureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
