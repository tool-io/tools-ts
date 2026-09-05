import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  linearFit,
  lnResidual,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedLeachTimesSeconds: readonly number[];
  readonly observedLeachRecoveryFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentFirstOrderLeachRatePerSecond: number;
  readonly leachResidualFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedLeachTimesSeconds",
    label: "Observed leach times seconds",
    kind: "numberList",
  },
  {
    id: "observedLeachRecoveryFractions",
    label: "Observed leach recovery fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLeachTimesSeconds.forEach((v) =>
    nonnegative(v, "observedLeachTimesSeconds"),
  );
  input.observedLeachRecoveryFractions.forEach((v) =>
    fraction(v, "observedLeachRecoveryFractions"),
  );
  const f = linearFit(
    input.observedLeachTimesSeconds,
    lnResidual(input.observedLeachRecoveryFractions, 1),
  );
  return {
    apparentFirstOrderLeachRatePerSecond: -f.slope,
    leachResidualFitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLeachTimesSeconds: [0, 1, 2],
  observedLeachRecoveryFractions: [0, 0.5, 0.75],
} satisfies Input;
export const exampleOutput = {
  apparentFirstOrderLeachRatePerSecond: 0.6931471805599453,
  leachResidualFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/leaching-rate-constant",
  title: "Leaching Rate Constant Calculator",
  description:
    "Extract actual first-order leach log-residual rate, not shrinking-core reaction-controlled forward equation; signed fitted apparent rate no causality or reagent prescription. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentFirstOrderLeachRatePerSecond",
      label: "Apparent first order leach rate per second",
      kind: "number",
    },
    {
      id: "leachResidualFitRSquared",
      label: "Leach residual fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLeachTimesSeconds:
        value.observedLeachTimesSeconds as readonly number[],
      observedLeachRecoveryFractions:
        value.observedLeachRecoveryFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
