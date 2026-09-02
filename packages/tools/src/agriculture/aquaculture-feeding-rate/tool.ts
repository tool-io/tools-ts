import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyFedDryFeedKg: readonly number[];
  readonly observedAquacultureBiomassKg: readonly number[];
  readonly observedFeedExposureDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBiomassExposureFeedingFractionPerDay: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyFedDryFeedKg",
    label: "Observed already fed dry feed kg",
    kind: "numberList",
  },
  {
    id: "observedAquacultureBiomassKg",
    label: "Observed aquaculture biomass kg",
    kind: "numberList",
  },
  {
    id: "observedFeedExposureDays",
    label: "Observed feed exposure days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAquacultureBiomassKg.forEach((v) =>
    positive(v, "observedAquacultureBiomassKg"),
  );
  input.observedFeedExposureDays.forEach((v) =>
    positive(v, "observedFeedExposureDays"),
  );
  input.observedAlreadyFedDryFeedKg.forEach((v) =>
    nonnegative(v, "observedAlreadyFedDryFeedKg"),
  );
  aligned(
    input.observedAlreadyFedDryFeedKg,
    input.observedAquacultureBiomassKg,
    "observedAlreadyFedDryFeedKg",
  );
  aligned(
    input.observedAlreadyFedDryFeedKg,
    input.observedFeedExposureDays,
    "observedAlreadyFedDryFeedKg",
  );
  return {
    observedBiomassExposureFeedingFractionPerDay:
      sum(input.observedAlreadyFedDryFeedKg) /
      sum(
        input.observedAquacultureBiomassKg.map(
          (v, i) => v * input.observedFeedExposureDays[i],
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyFedDryFeedKg: [2, 4],
  observedAquacultureBiomassKg: [100, 200],
  observedFeedExposureDays: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedBiomassExposureFeedingFractionPerDay: 0.012,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/aquaculture-feeding-rate",
  title: "Agriculture Aquaculture Feeding Rate Calculator",
  description:
    "Audit already-fed material per matched biomass-day exposure, not a species feeding percentage recommendation or existing feed requirement. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBiomassExposureFeedingFractionPerDay",
      label: "Observed biomass exposure feeding fraction per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyFedDryFeedKg:
        value.observedAlreadyFedDryFeedKg as readonly number[],
      observedAquacultureBiomassKg:
        value.observedAquacultureBiomassKg as readonly number[],
      observedFeedExposureDays:
        value.observedFeedExposureDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
