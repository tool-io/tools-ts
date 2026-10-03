import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dueAt: number; readonly reviewedAt: number };
export type Output = { readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dueAt: { type: "number" }, reviewedAt: { type: "number" } },
  required: ["dueAt", "reviewedAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" } },
  required: ["slack"],
} as const;
/** Compare explicit protective asset record review times without security assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dueAt, reviewedAt } = request;
  const compute = (): Output => {
    return { slack: dueAt - reviewedAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dueAt: 30, reviewedAt: 25 },
  output: { slack: 5 },
} satisfies ToolExample<Input, Output>;
export const protectiveAssetReviewSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/protective-asset-review-slack",
    title: "Protective Asset Review Slack Tool",
    description:
      "Compare explicit protective asset record review times without security assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dueAt: { type: "number" }, reviewedAt: { type: "number" } },
      required: ["dueAt", "reviewedAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slack: { type: "number" } },
      required: ["slack"],
    },
    ports: {
      inputs: [
        {
          id: "dueAt",
          label: "Due At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reviewedAt",
          label: "Reviewed At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "slack", label: "Slack", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = protectiveAssetReviewSlackTool.execute;
export default protectiveAssetReviewSlackTool;
