import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedStrawWetMassKg: readonly number[];
  readonly matchedStrawDryFractions: readonly number[];
  readonly observedGrainWetMassKg: readonly number[];
  readonly matchedGrainDryFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledDryStrawToDryGrainRatio: number;
}>;
const inputFields = [
  {
    id: "observedStrawWetMassKg",
    label: "Observed straw wet mass kg",
    kind: "numberList",
  },
  {
    id: "matchedStrawDryFractions",
    label: "Matched straw dry fractions",
    kind: "numberList",
  },
  {
    id: "observedGrainWetMassKg",
    label: "Observed grain wet mass kg",
    kind: "numberList",
  },
  {
    id: "matchedGrainDryFractions",
    label: "Matched grain dry fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStrawWetMassKg.forEach((v) =>
    nonnegative(v, "observedStrawWetMassKg"),
  );
  input.observedGrainWetMassKg.forEach((v) =>
    nonnegative(v, "observedGrainWetMassKg"),
  );
  input.matchedStrawDryFractions.forEach((v) =>
    fraction(v, "matchedStrawDryFractions"),
  );
  input.matchedGrainDryFractions.forEach((v) =>
    fraction(v, "matchedGrainDryFractions"),
  );
  aligned(
    input.observedStrawWetMassKg,
    input.matchedStrawDryFractions,
    "observedStrawWetMassKg",
  );
  aligned(
    input.observedStrawWetMassKg,
    input.observedGrainWetMassKg,
    "observedStrawWetMassKg",
  );
  aligned(
    input.observedStrawWetMassKg,
    input.matchedGrainDryFractions,
    "observedStrawWetMassKg",
  );
  const grain = sum(
    input.observedGrainWetMassKg.map(
      (v, i) => v * input.matchedGrainDryFractions[i],
    ),
  );
  positive(grain, "dry grain");
  return {
    pooledDryStrawToDryGrainRatio:
      sum(
        input.observedStrawWetMassKg.map(
          (v, i) => v * input.matchedStrawDryFractions[i],
        ),
      ) / grain,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStrawWetMassKg: [10, 20],
  matchedStrawDryFractions: [0.5, 0.5],
  observedGrainWetMassKg: [5, 10],
  matchedGrainDryFractions: [0.8, 0.8],
} satisfies Input;
export const exampleOutput = {
  pooledDryStrawToDryGrainRatio: 1.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/straw-to-grain-ratio",
  title: "Agriculture Straw To Grain Ratio Calculator",
  description:
    "Actual paired moisture-adjusted harvest components, not whole-plant harvest-index formula or assumed straw multiplier. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledDryStrawToDryGrainRatio",
      label: "Pooled dry straw to dry grain ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStrawWetMassKg: value.observedStrawWetMassKg as readonly number[],
      matchedStrawDryFractions:
        value.matchedStrawDryFractions as readonly number[],
      observedGrainWetMassKg: value.observedGrainWetMassKg as readonly number[],
      matchedGrainDryFractions:
        value.matchedGrainDryFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
