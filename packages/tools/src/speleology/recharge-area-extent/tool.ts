import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualAnnualSpringDischargeVolumeCubicMeters: number;
  readonly callerIndependentlyEstablishedEffectiveAnnualRechargeMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAnnualSpringDischargeVolumeCubicMeters",
    label: "Actual annual spring discharge volume cubic meters",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedEffectiveAnnualRechargeMeters",
    label: "Caller independently established effective annual recharge meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualAnnualSpringDischargeVolumeCubicMeters, "numerator");
  positive(
    input.callerIndependentlyEstablishedEffectiveAnnualRechargeMeters,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualAnnualSpringDischargeVolumeCubicMeters) /
      input.callerIndependentlyEstablishedEffectiveAnnualRechargeMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAnnualSpringDischargeVolumeCubicMeters: 2,
    callerIndependentlyEstablishedEffectiveAnnualRechargeMeters: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/recharge-area-extent",
  title: "Recharge Area Extent Estimate Calculator",
  description:
    "Steady actual discharge/effective recharge catchment area scenario; storage, interbasin flow and leakage assumptions independently established. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
