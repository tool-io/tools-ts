import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  integrator: number;
  requestedIncrement: number;
  lower: number;
  upper: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "integrator", label: "Integrator", kind: "number" },
  { id: "requestedIncrement", label: "Requested increment", kind: "number" },
  { id: "lower", label: "Lower", kind: "number" },
  { id: "upper", label: "Upper", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.lower <= i.upper && i.integrator >= i.lower && i.integrator <= i.upper,
  );
  const next = Math.min(
    i.upper,
    Math.max(i.lower, i.integrator + i.requestedIncrement),
  );
  return H.finish({
    nextIntegrator: next,
    acceptedIncrement: next - i.integrator,
    rejectedIncrement: i.requestedIncrement - (next - i.integrator),
  });
};
export const example = {
  input: { integrator: 4, requestedIncrement: 3, lower: 0, upper: 5 },
  output: {
    result: { nextIntegrator: 5, acceptedIncrement: 1, rejectedIncrement: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cybernetics/controller-integrator-clamp-delta",
  title: "Cybernetics: Controller Integrator Clamp Delta Tool",
  description:
    "Apply one bounded integrator clamping step and expose accepted/rejected increments; no closed-loop stability, anti-windup tuning or hardware I/O.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          acceptedIncrement: { type: "number" },
          nextIntegrator: { type: "number" },
          rejectedIncrement: { type: "number" },
        },
        required: ["acceptedIncrement", "nextIntegrator", "rejectedIncrement"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
