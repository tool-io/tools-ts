import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedVerticalAnnularLiquidSpeedsMSecond: readonly number[];
  readonly callerIndependentCuttingsSlipSpeedsMSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedApparentCuttingsTransportRatios: readonly number[];
}>;
const inputFields = [
  {
    id: "observedVerticalAnnularLiquidSpeedsMSecond",
    label: "Observed vertical annular liquid speeds m second",
    kind: "numberList",
  },
  {
    id: "callerIndependentCuttingsSlipSpeedsMSecond",
    label: "Caller independent cuttings slip speeds m second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedVerticalAnnularLiquidSpeedsMSecond.forEach((v) =>
    positive(v, "observedVerticalAnnularLiquidSpeedsMSecond"),
  );
  input.callerIndependentCuttingsSlipSpeedsMSecond.forEach((v) =>
    nonnegative(v, "callerIndependentCuttingsSlipSpeedsMSecond"),
  );
  aligned(
    input.observedVerticalAnnularLiquidSpeedsMSecond,
    input.callerIndependentCuttingsSlipSpeedsMSecond,
    "observedVerticalAnnularLiquidSpeedsMSecond",
  );
  return {
    observedApparentCuttingsTransportRatios:
      input.observedVerticalAnnularLiquidSpeedsMSecond.map(
        (v, i) => 1 - input.callerIndependentCuttingsSlipSpeedsMSecond[i] / v,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVerticalAnnularLiquidSpeedsMSecond: [2, 3],
  callerIndependentCuttingsSlipSpeedsMSecond: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  observedApparentCuttingsTransportRatios: [0.75, 0.6666666666666666],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/cuttings-transport-ratio",
  title: "Petroleum Cuttings Transport Ratio Calculator",
  description:
    "Audit vertical dilute cuttings transport ratio1−slip/liquid speed from independently observed slip, negative settling evidence retained; no deviated-well bed transport model or prescribed circulation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedApparentCuttingsTransportRatios",
      label: "Observed apparent cuttings transport ratios",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedVerticalAnnularLiquidSpeedsMSecond:
        value.observedVerticalAnnularLiquidSpeedsMSecond as readonly number[],
      callerIndependentCuttingsSlipSpeedsMSecond:
        value.callerIndependentCuttingsSlipSpeedsMSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
