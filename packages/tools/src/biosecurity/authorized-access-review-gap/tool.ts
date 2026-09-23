import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reviewedAt: number; readonly dueAt: number };
export type Output = { readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reviewedAt: { type: "number" }, dueAt: { type: "number" } },
  required: ["reviewedAt", "dueAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" } },
  required: ["remaining"],
} as const;
/** Compare supplied authorized-access review clocks; no access bypass or authorization decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewedAt, dueAt } = request;
  const compute = (): Output => {
    return { remaining: dueAt - reviewedAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reviewedAt: 20, dueAt: 30 },
  output: { remaining: 10 },
} satisfies ToolExample<Input, Output>;
export const authorizedAccessReviewGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/authorized-access-review-gap",
    title: "Authorized Access Review Gap Tool",
    description:
      "Compare supplied authorized-access review clocks; no access bypass or authorization decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reviewedAt: { type: "number" }, dueAt: { type: "number" } },
      required: ["reviewedAt", "dueAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remaining: { type: "number" } },
      required: ["remaining"],
    },
    ports: {
      inputs: [
        {
          id: "reviewedAt",
          label: "Reviewed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dueAt",
          label: "Due At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = authorizedAccessReviewGapTool.execute;
export default authorizedAccessReviewGapTool;
