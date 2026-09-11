import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualTotalOperatingHours: number;
  readonly actualObservedFailureCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTotalOperatingHours",
    label: "Actual total operating hours",
    kind: "number",
  },
  {
    id: "actualObservedFailureCount",
    label: "Actual observed failure count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualTotalOperatingHours, "actualTotalOperatingHours");
  bounded(
    input.actualObservedFailureCount,
    "actualObservedFailureCount",
    1,
    1000000,
  );
  return {
    value: input.actualTotalOperatingHours / input.actualObservedFailureCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualTotalOperatingHours: 10, actualObservedFailureCount: 2 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/reliability-mtbf",
  title: "MTBF Reliability Calculator",
  description:
    "Actual repair able-system exposure/failure MTBF point estimate, no assumed exponential survival probability or confidence bound. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
