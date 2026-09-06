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
  readonly observedAlreadyTestedGasConingRatesM3Day: readonly number[];
  readonly observedGasConingUnwantedPhaseFractions: readonly number[];
  readonly callerGasConingPhaseCriterionFraction: number;
}>;
export type Output = Readonly<{
  readonly observedConingCriterionRateCrossingsM3Day: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlreadyTestedGasConingRatesM3Day",
    label: "Observed already tested gas coning rates m3 day",
    kind: "numberList",
  },
  {
    id: "observedGasConingUnwantedPhaseFractions",
    label: "Observed gas coning unwanted phase fractions",
    kind: "numberList",
  },
  {
    id: "callerGasConingPhaseCriterionFraction",
    label: "Caller gas coning phase criterion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlreadyTestedGasConingRatesM3Day.forEach((v) =>
    nonnegative(v, "observedAlreadyTestedGasConingRatesM3Day"),
  );
  input.observedGasConingUnwantedPhaseFractions.forEach((v) =>
    fraction(v, "observedGasConingUnwantedPhaseFractions"),
  );
  fraction(
    input.callerGasConingPhaseCriterionFraction,
    "callerGasConingPhaseCriterionFraction",
  );
  return {
    observedConingCriterionRateCrossingsM3Day: crossings(
      input.observedAlreadyTestedGasConingRatesM3Day,
      input.observedGasConingUnwantedPhaseFractions,
      input.callerGasConingPhaseCriterionFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyTestedGasConingRatesM3Day: [1, 2, 3],
  observedGasConingUnwantedPhaseFractions: [0, 0.2, 0.4],
  callerGasConingPhaseCriterionFraction: 0.3,
} satisfies Input;
export const exampleOutput = {
  observedConingCriterionRateCrossingsM3Day: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/coning-critical-rate-gas",
  title: "Petroleum Coning Critical Rate Gas Calculator",
  description:
    "Extract actual already completed GasConing phase criterion/rate crossings, no unverified analytical critical-rate correlation, test procedure or safe production-rate claim. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedAlreadyTestedGasConingRatesM3Day:
        value.observedAlreadyTestedGasConingRatesM3Day as readonly number[],
      observedGasConingUnwantedPhaseFractions:
        value.observedGasConingUnwantedPhaseFractions as readonly number[],
      callerGasConingPhaseCriterionFraction:
        value.callerGasConingPhaseCriterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
