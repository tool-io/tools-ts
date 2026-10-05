import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialIndex: number;
  readonly order: number;
  readonly requestedIndex: number;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialIndex: { type: "integer", minimum: -1000000, maximum: 1000000 },
    order: { type: "integer", minimum: 1, maximum: 256 },
    requestedIndex: { type: "integer", minimum: -1000000, maximum: 1000000 },
  },
  required: ["initialIndex", "order", "requestedIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Classify an index relative to a recurrence's initial-condition block; the first computed term is initialIndex + order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialIndex, order, requestedIndex } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(initialIndex) &&
        initialIndex >= -1000000 &&
        initialIndex <= 1000000,
      "initialIndex",
    ),
      initialIndex);
    (H.domain(
      Number.isSafeInteger(order) && order >= 1 && order <= 256,
      "order",
    ),
      order);
    (H.domain(
      Number.isSafeInteger(requestedIndex) &&
        requestedIndex >= -1000000 &&
        requestedIndex <= 1000000,
      "requestedIndex",
    ),
      requestedIndex);
    return {
      status:
        requestedIndex < initialIndex
          ? "before-sequence"
          : requestedIndex < initialIndex + order
            ? "initial-condition"
            : "recurrence-step",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialIndex: 0, order: 2, requestedIndex: 1 },
  output: { status: "initial-condition" },
} satisfies ToolExample<Input, Output>;
export const recurrenceStepBoundaryLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/recurrence-step-boundary-label",
    title: "Recurrence Step Boundary Label Tool",
    description:
      "Classify an index relative to a recurrence's initial-condition block; the first computed term is initialIndex + order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialIndex: { type: "integer", minimum: -1000000, maximum: 1000000 },
        order: { type: "integer", minimum: 1, maximum: 256 },
        requestedIndex: {
          type: "integer",
          minimum: -1000000,
          maximum: 1000000,
        },
      },
      required: ["initialIndex", "order", "requestedIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "initialIndex",
          label: "Initial Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "order",
          label: "Order",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requestedIndex",
          label: "Requested Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = recurrenceStepBoundaryLabelTool.execute;
export default recurrenceStepBoundaryLabelTool;
