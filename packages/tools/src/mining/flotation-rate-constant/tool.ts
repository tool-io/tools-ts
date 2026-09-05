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
  fraction,
  strictlyIncreasing,
  lnResidual,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedTwoFlotationTimesSeconds: readonly number[];
  readonly observedRecoveryFractions: readonly number[];
  readonly callerIndependentlyEstablishedUltimateFraction: number;
}>;
export type Output = Readonly<{
  readonly twoPointApparentFlotationRatePerSecond: number;
}>;
const inputFields = [
  {
    id: "observedTwoFlotationTimesSeconds",
    label: "Observed two flotation times seconds",
    kind: "numberList",
  },
  {
    id: "observedRecoveryFractions",
    label: "Observed recovery fractions",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedUltimateFraction",
    label: "Caller independently established ultimate fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTwoFlotationTimesSeconds.forEach((v) =>
    nonnegative(v, "observedTwoFlotationTimesSeconds"),
  );
  input.observedRecoveryFractions.forEach((v) =>
    fraction(v, "observedRecoveryFractions"),
  );
  fraction(
    input.callerIndependentlyEstablishedUltimateFraction,
    "callerIndependentlyEstablishedUltimateFraction",
  );
  if (
    input.observedTwoFlotationTimesSeconds.length !== 2 ||
    input.observedRecoveryFractions.length !== 2
  )
    simpleError("pairs", "Exactly two matched flotation points required.");
  strictlyIncreasing(input.observedTwoFlotationTimesSeconds, "times");
  const logs = lnResidual(
    input.observedRecoveryFractions,
    input.callerIndependentlyEstablishedUltimateFraction,
  );
  return {
    twoPointApparentFlotationRatePerSecond:
      -(logs[1] - logs[0]) /
      (input.observedTwoFlotationTimesSeconds[1] -
        input.observedTwoFlotationTimesSeconds[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTwoFlotationTimesSeconds: [1, 3],
  observedRecoveryFractions: [0.2, 0.6],
  callerIndependentlyEstablishedUltimateFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  twoPointApparentFlotationRatePerSecond: 0.5493061443340549,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/flotation-rate-constant",
  title: "Flotation Rate Constant Calculator",
  description:
    "Extract actual two-point apparent flotation residual decay with independent ultimate recovery, signed inverse-rate retained; distinct from existing multi-point unconstrained-intercept fit. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "twoPointApparentFlotationRatePerSecond",
      label: "Two point apparent flotation rate per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTwoFlotationTimesSeconds:
        value.observedTwoFlotationTimesSeconds as readonly number[],
      observedRecoveryFractions:
        value.observedRecoveryFractions as readonly number[],
      callerIndependentlyEstablishedUltimateFraction:
        value.callerIndependentlyEstablishedUltimateFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
