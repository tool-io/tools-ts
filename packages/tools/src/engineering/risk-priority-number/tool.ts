import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerSeverity: number;
  readonly callerOccurrence: number;
  readonly callerDetection: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerSeverity", label: "Caller severity", kind: "number" },
  { id: "callerOccurrence", label: "Caller occurrence", kind: "number" },
  { id: "callerDetection", label: "Caller detection", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerSeverity, "callerSeverity", 1, 1000000);
  bounded(input.callerOccurrence, "callerOccurrence", 1, 1000000);
  bounded(input.callerDetection, "callerDetection", 1, 1000000);
  [input.callerSeverity, input.callerOccurrence, input.callerDetection].forEach(
    (v) => bounded(v, "FMEAcode", 1, 10),
  );
  return {
    value:
      input.callerSeverity * input.callerOccurrence * input.callerDetection,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerSeverity: 2, callerOccurrence: 3, callerDetection: 4 },
  output: { result: { value: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/risk-priority-number",
  title: "Risk Priority Number Calculator",
  description:
    "FMEA ordinal risk priority number product of three independently established1\u201310codes, not calibrated probability, expected harm or automatic priority authority. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
