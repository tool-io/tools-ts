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
  readonly observedAlreadyTestedOilConingRatesM3Day: readonly number[];
  readonly observedOilConingUnwantedPhaseFractions: readonly number[];
  readonly callerOilConingPhaseCriterionFraction: number;
}>;
export type Output = Readonly<{
  readonly observedConingCriterionRateCrossingsM3Day: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlreadyTestedOilConingRatesM3Day",
    label: "Observed already tested oil coning rates m3 day",
    kind: "numberList",
  },
  {
    id: "observedOilConingUnwantedPhaseFractions",
    label: "Observed oil coning unwanted phase fractions",
    kind: "numberList",
  },
  {
    id: "callerOilConingPhaseCriterionFraction",
    label: "Caller oil coning phase criterion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlreadyTestedOilConingRatesM3Day.forEach((v) =>
    nonnegative(v, "observedAlreadyTestedOilConingRatesM3Day"),
  );
  input.observedOilConingUnwantedPhaseFractions.forEach((v) =>
    fraction(v, "observedOilConingUnwantedPhaseFractions"),
  );
  fraction(
    input.callerOilConingPhaseCriterionFraction,
    "callerOilConingPhaseCriterionFraction",
  );
  return {
    observedConingCriterionRateCrossingsM3Day: crossings(
      input.observedAlreadyTestedOilConingRatesM3Day,
      input.observedOilConingUnwantedPhaseFractions,
      input.callerOilConingPhaseCriterionFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyTestedOilConingRatesM3Day: [1, 2, 3],
  observedOilConingUnwantedPhaseFractions: [0, 0.2, 0.4],
  callerOilConingPhaseCriterionFraction: 0.3,
} satisfies Input;
export const exampleOutput = {
  observedConingCriterionRateCrossingsM3Day: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/coning-critical-rate-oil",
  title: "Petroleum Coning Critical Rate Oil Calculator",
  description:
    "Extract actual already completed OilConing phase criterion/rate crossings, no unverified analytical critical-rate correlation, test procedure or safe production-rate claim. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedAlreadyTestedOilConingRatesM3Day:
        value.observedAlreadyTestedOilConingRatesM3Day as readonly number[],
      observedOilConingUnwantedPhaseFractions:
        value.observedOilConingUnwantedPhaseFractions as readonly number[],
      callerOilConingPhaseCriterionFraction:
        value.callerOilConingPhaseCriterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
