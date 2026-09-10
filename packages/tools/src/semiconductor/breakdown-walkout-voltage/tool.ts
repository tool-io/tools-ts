import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPostStressBreakdownVoltage: number;
  readonly actualPreStressBreakdownVoltage: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPostStressBreakdownVoltage",
    label: "Actual post stress breakdown voltage",
    kind: "number",
  },
  {
    id: "actualPreStressBreakdownVoltage",
    label: "Actual pre stress breakdown voltage",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualPostStressBreakdownVoltage, "first");
  nonnegative(input.actualPreStressBreakdownVoltage, "second");
  return {
    signedObservedDifference:
      input.actualPostStressBreakdownVoltage -
      input.actualPreStressBreakdownVoltage,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPostStressBreakdownVoltage: 5,
    actualPreStressBreakdownVoltage: 3,
  },
  output: { result: { signedObservedDifference: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/breakdown-walkout-voltage",
  title: "Semiconductor Breakdown Walkout Voltage Calculator",
  description:
    "Signed observed device breakdown walkout, not automatic process-induced cause attribution. Actual independently matched units, contexts and definitions; signed differences retained, not a validated risk or safety claim.",
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
