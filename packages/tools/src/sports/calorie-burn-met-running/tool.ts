import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerIndependentApplicableRunningMet: number;
  readonly actualBodyMassKg: number;
  readonly actualRunningMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentApplicableRunningMet",
    label: "Caller independent applicable running met",
    kind: "number",
  },
  { id: "actualBodyMassKg", label: "Actual body mass kg", kind: "number" },
  {
    id: "actualRunningMinutes",
    label: "Actual running minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentApplicableRunningMet,
    "callerIndependentApplicableRunningMet",
  );
  positive(input.actualBodyMassKg, "actualBodyMassKg");
  nonnegative(input.actualRunningMinutes, "actualRunningMinutes");
  return {
    value:
      ((input.callerIndependentApplicableRunningMet *
        input.actualBodyMassKg *
        3.5) /
        200) *
      input.actualRunningMinutes,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerIndependentApplicableRunningMet: 2,
    actualBodyMassKg: 10,
    actualRunningMinutes: 300,
  },
  output: { result: { value: 105 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/calorie-burn-met-running",
  title: "Running MET Calorie Burn Calculator",
  description:
    "DeclaredgrossnormalizationrunningMET\u00d7masskg\u00d73.5/200\u00d7minutes kcal,independentapplicableMETnot selected,nomeasured individualexpenditure/dose. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
