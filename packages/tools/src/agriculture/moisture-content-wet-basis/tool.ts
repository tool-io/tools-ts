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
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedWetSampleMassKg: readonly number[];
  readonly ovenDryMatchedSampleMassKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly sampleWetBasisMoistureFractions: readonly number[];
  readonly pooledWetBasisMoistureFraction: number;
}>;
const inputFields = [
  {
    id: "observedWetSampleMassKg",
    label: "Observed wet sample mass kg",
    kind: "numberList",
  },
  {
    id: "ovenDryMatchedSampleMassKg",
    label: "Oven dry matched sample mass kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWetSampleMassKg.forEach((v) =>
    positive(v, "observedWetSampleMassKg"),
  );
  input.ovenDryMatchedSampleMassKg.forEach((v) =>
    nonnegative(v, "ovenDryMatchedSampleMassKg"),
  );
  aligned(
    input.observedWetSampleMassKg,
    input.ovenDryMatchedSampleMassKg,
    "observedWetSampleMassKg",
  );
  input.ovenDryMatchedSampleMassKg.forEach((v, i) => {
    if (v > input.observedWetSampleMassKg[i])
      simpleError("dry", "Matched dry≤wet mass.");
  });
  return {
    sampleWetBasisMoistureFractions: input.observedWetSampleMassKg.map(
      (v, i) => 1 - input.ovenDryMatchedSampleMassKg[i] / v,
    ),
    pooledWetBasisMoistureFraction:
      1 -
      sum(input.ovenDryMatchedSampleMassKg) /
        sum(input.observedWetSampleMassKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWetSampleMassKg: [10, 20],
  ovenDryMatchedSampleMassKg: [8, 14],
} satisfies Input;
export const exampleOutput = {
  sampleWetBasisMoistureFractions: [0.2, 0.3],
  pooledWetBasisMoistureFraction: 0.26666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/moisture-content-wet-basis",
  title: "Agriculture Moisture Content Wet Basis Calculator",
  description:
    "Mass-weighted actual paired samples on WET denominator, not existing dry-basis lumber or dry-matter multiplication. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "sampleWetBasisMoistureFractions",
      label: "Sample wet basis moisture fractions",
      kind: "numberList",
    },
    {
      id: "pooledWetBasisMoistureFraction",
      label: "Pooled wet basis moisture fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWetSampleMassKg:
        value.observedWetSampleMassKg as readonly number[],
      ovenDryMatchedSampleMassKg:
        value.ovenDryMatchedSampleMassKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
