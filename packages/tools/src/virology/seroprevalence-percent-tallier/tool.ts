import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{ positiveSamples: number; totalSamples: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "positiveSamples", label: "Positive samples", kind: "number" },
  { id: "totalSamples", label: "Total samples", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    observedSeroprevalencePercent:
      100 * countFraction(i.positiveSamples, i.totalSamples),
    populationInference: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { positiveSamples: 20, totalSamples: 100 },
  output: {
    result: {
      observedSeroprevalencePercent: 20,
      populationInference: "not-established",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/seroprevalence-percent-tallier",
  title: "Seroprevalence Percent Positive Sample Tallier",
  description:
    "Tally observed sample seropositivity; no assay adjustment, sampling-weight correction or population inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
