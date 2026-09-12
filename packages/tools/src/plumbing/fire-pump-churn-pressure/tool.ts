import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredChurnDischargePsi: number;
  readonly actualMeasuredChurnSuctionPsi: number;
  readonly callerIndependentlyApplicableMaximumNetChurnPsi: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredChurnDischargePsi",
    label: "Actual measured churn discharge psi",
    kind: "number",
  },
  {
    id: "actualMeasuredChurnSuctionPsi",
    label: "Actual measured churn suction psi",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicableMaximumNetChurnPsi",
    label: "Caller independently applicable maximum net churn psi",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerIndependentlyApplicableMaximumNetChurnPsi, "limit");
  const p =
    input.actualMeasuredChurnDischargePsi - input.actualMeasuredChurnSuctionPsi;
  return {
    actualNetChurnPressurePsi: p,
    signedNetChurnMinusCallerLimitPsi:
      p - input.callerIndependentlyApplicableMaximumNetChurnPsi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredChurnDischargePsi: 20,
    actualMeasuredChurnSuctionPsi: 5,
    callerIndependentlyApplicableMaximumNetChurnPsi: 12,
  },
  output: {
    result: {
      actualNetChurnPressurePsi: 15,
      signedNetChurnMinusCallerLimitPsi: 3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/fire-pump-churn-pressure",
  title: "Plumbing Fire Pump Churn Pressure Calculator",
  description:
    "Actual fire pump zero-flow churn NET discharge minus suction, compare independent matched allowable limit signed only, not infer churn from rated multiplier or certify acceptance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
