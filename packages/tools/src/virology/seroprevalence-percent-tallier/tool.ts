import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{ positiveSamples: number; totalSamples: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "positiveSamples", label: "Positive samples", kind: "number" },
  { id: "totalSamples", label: "Total samples", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    observedSeroprevalencePercent:
      100 * countFraction(i.positiveSamples, i.totalSamples),
    populationInference: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
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

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedSeroprevalencePercent: { type: "number" },
          populationInference: { type: "string" },
        },
        required: ["observedSeroprevalencePercent", "populationInference"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
