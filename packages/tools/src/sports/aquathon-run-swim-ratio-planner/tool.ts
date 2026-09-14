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
  readonly callerPlannedRunSeconds: number;
  readonly callerPlannedSwimSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerPlannedRunSeconds",
    label: "Caller planned run seconds",
    kind: "number",
  },
  {
    id: "callerPlannedSwimSeconds",
    label: "Caller planned swim seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerPlannedRunSeconds, "callerPlannedRunSeconds");
  positive(input.callerPlannedSwimSeconds, "callerPlannedSwimSeconds");
  return {
    value: input.callerPlannedRunSeconds / input.callerPlannedSwimSeconds,
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
  input: { callerPlannedRunSeconds: 200, callerPlannedSwimSeconds: 100 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/aquathon-run-swim-ratio-planner",
  title: "Aquathlon Run-Swim Ratio Planner",
  description:
    "Callerindependently plannedrun/swimTIMEallocationratio,not samedistancemixedsports paceor optimumtrainingprescription. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
