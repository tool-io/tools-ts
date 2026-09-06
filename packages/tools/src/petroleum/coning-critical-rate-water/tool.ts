import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  crossings,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyTestedWaterConingRatesM3Day: readonly number[];
  readonly observedWaterConingUnwantedPhaseFractions: readonly number[];
  readonly callerWaterConingPhaseCriterionFraction: number;
}>;
export type Output = Readonly<{
  readonly observedConingCriterionRateCrossingsM3Day: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlreadyTestedWaterConingRatesM3Day",
    label: "Observed already tested water coning rates m3 day",
    kind: "numberList",
  },
  {
    id: "observedWaterConingUnwantedPhaseFractions",
    label: "Observed water coning unwanted phase fractions",
    kind: "numberList",
  },
  {
    id: "callerWaterConingPhaseCriterionFraction",
    label: "Caller water coning phase criterion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlreadyTestedWaterConingRatesM3Day.forEach((v) =>
    nonnegative(v, "observedAlreadyTestedWaterConingRatesM3Day"),
  );
  input.observedWaterConingUnwantedPhaseFractions.forEach((v) =>
    fraction(v, "observedWaterConingUnwantedPhaseFractions"),
  );
  fraction(
    input.callerWaterConingPhaseCriterionFraction,
    "callerWaterConingPhaseCriterionFraction",
  );
  return {
    observedConingCriterionRateCrossingsM3Day: crossings(
      input.observedAlreadyTestedWaterConingRatesM3Day,
      input.observedWaterConingUnwantedPhaseFractions,
      input.callerWaterConingPhaseCriterionFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyTestedWaterConingRatesM3Day: [1, 2, 3],
  observedWaterConingUnwantedPhaseFractions: [0, 0.2, 0.4],
  callerWaterConingPhaseCriterionFraction: 0.3,
} satisfies Input;
export const exampleOutput = {
  observedConingCriterionRateCrossingsM3Day: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/coning-critical-rate-water",
  title: "Petroleum Coning Critical Rate Water Calculator",
  description:
    "Extract actual already completed WaterConing phase criterion/rate crossings, no unverified analytical critical-rate correlation, test procedure or safe production-rate claim. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedConingCriterionRateCrossingsM3Day",
      label: "Observed coning criterion rate crossings m3 day",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyTestedWaterConingRatesM3Day:
        value.observedAlreadyTestedWaterConingRatesM3Day as readonly number[],
      observedWaterConingUnwantedPhaseFractions:
        value.observedWaterConingUnwantedPhaseFractions as readonly number[],
      callerWaterConingPhaseCriterionFraction:
        value.callerWaterConingPhaseCriterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
