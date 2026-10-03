import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dueAt: number;
  readonly reviewedAt: number;
  readonly creditedPause: number;
};
export type Output = { readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dueAt: { type: "number" },
    reviewedAt: { type: "number" },
    creditedPause: { type: "number", minimum: 0 },
  },
  required: ["dueAt", "reviewedAt", "creditedPause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" } },
  required: ["slack"],
} as const;
/** Audit supplied CAPA review clocks without asserting regulatory compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dueAt, reviewedAt, creditedPause } = request;
  const compute = (): Output => {
    H.domain(creditedPause >= 0);
    return { slack: dueAt - reviewedAt + creditedPause };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dueAt: 30, reviewedAt: 25, creditedPause: 2 },
  output: { slack: 7 },
} satisfies ToolExample<Input, Output>;
export const capaReviewTimeSlackTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "quality-assurance/capa-review-time-slack",
      title: "CAPA Review Time Slack Tool",
      description:
        "Audit supplied CAPA review clocks without asserting regulatory compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dueAt: { type: "number" },
          reviewedAt: { type: "number" },
          creditedPause: { type: "number", minimum: 0 },
        },
        required: ["dueAt", "reviewedAt", "creditedPause"],
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
          {
            id: "creditedPause",
            label: "Credited Pause",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "slack", label: "Slack", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = capaReviewTimeSlackTool.execute;
export default capaReviewTimeSlackTool;
