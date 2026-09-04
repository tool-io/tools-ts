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
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMushroomHarvestKg: readonly number[];
  readonly observedSampleHarvestAreasHa: readonly number[];
  readonly callerDetectionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly detectionCorrectedSampleYieldKgHa: number;
}>;
const inputFields = [
  {
    id: "observedMushroomHarvestKg",
    label: "Observed mushroom harvest kg",
    kind: "numberList",
  },
  {
    id: "observedSampleHarvestAreasHa",
    label: "Observed sample harvest areas ha",
    kind: "numberList",
  },
  {
    id: "callerDetectionFractions",
    label: "Caller detection fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSampleHarvestAreasHa.forEach((v) =>
    positive(v, "observedSampleHarvestAreasHa"),
  );
  input.callerDetectionFractions.forEach((v) =>
    positive(v, "callerDetectionFractions"),
  );
  input.observedMushroomHarvestKg.forEach((v) =>
    nonnegative(v, "observedMushroomHarvestKg"),
  );
  input.callerDetectionFractions.forEach((v) =>
    fraction(v, "callerDetectionFractions"),
  );
  aligned(
    input.observedMushroomHarvestKg,
    input.observedSampleHarvestAreasHa,
    "observedMushroomHarvestKg",
  );
  aligned(
    input.observedMushroomHarvestKg,
    input.callerDetectionFractions,
    "observedMushroomHarvestKg",
  );
  return {
    detectionCorrectedSampleYieldKgHa:
      sum(
        input.observedMushroomHarvestKg.map(
          (v, i) => v / input.callerDetectionFractions[i],
        ),
      ) / sum(input.observedSampleHarvestAreasHa),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMushroomHarvestKg: [2, 3],
  observedSampleHarvestAreasHa: [0.1, 0.2],
  callerDetectionFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  detectionCorrectedSampleYieldKgHa: 23.333333333333336,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/mushroom-picking-yield-kg-per-hectare-season",
  title: "Mushroom Yield kg/ha Season Estimate",
  description:
    "Normalize observed season mushroom samples with independently justified detection correction, not species edibility, future yield or harvest permission. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "detectionCorrectedSampleYieldKgHa",
      label: "Detection corrected sample yield kg ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMushroomHarvestKg:
        value.observedMushroomHarvestKg as readonly number[],
      observedSampleHarvestAreasHa:
        value.observedSampleHarvestAreasHa as readonly number[],
      callerDetectionFractions:
        value.callerDetectionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
