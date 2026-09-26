import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSum: number;
  readonly observedItems: number;
  readonly expectedItems: number;
  readonly allowProration: boolean;
};
export type Output = {
  readonly missingItems: number;
  readonly available: boolean;
  readonly score: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSum: { type: "number" },
    observedItems: { type: "integer", minimum: 1 },
    expectedItems: { type: "integer", minimum: 1 },
    allowProration: { type: "boolean" },
  },
  required: ["observedSum", "observedItems", "expectedItems", "allowProration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingItems: { type: "integer" },
    available: { type: "boolean" },
    score: { type: "number" },
  },
  required: ["missingItems", "available", "score"],
} as const;
/** Return an observed sum or explicitly prorated sum plus an availability flag; no instrument-specific missing-data rule is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedSum, observedItems, expectedItems, allowProration } = request;
  const compute = (): Output => {
    H.integer(expectedItems, 1);
    H.integer(observedItems, 1, expectedItems);
    return {
      missingItems: expectedItems - observedItems,
      available: observedItems === expectedItems || allowProration,
      score:
        observedItems === expectedItems || allowProration
          ? (observedSum * expectedItems) / observedItems
          : observedSum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedSum: 12,
    observedItems: 3,
    expectedItems: 4,
    allowProration: true,
  },
  output: { missingItems: 1, available: true, score: 16 },
} satisfies ToolExample<Input, Output>;
export const studentMotivationScaleMissingItemTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "educational-psychology/student-motivation-scale-missing-item-term",
      title: "Student Motivation Scale Missing Item Term Tool",
      description:
        "Return an observed sum or explicitly prorated sum plus an availability flag; no instrument-specific missing-data rule is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedSum: { type: "number" },
          observedItems: { type: "integer", minimum: 1 },
          expectedItems: { type: "integer", minimum: 1 },
          allowProration: { type: "boolean" },
        },
        required: [
          "observedSum",
          "observedItems",
          "expectedItems",
          "allowProration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingItems: { type: "integer" },
          available: { type: "boolean" },
          score: { type: "number" },
        },
        required: ["missingItems", "available", "score"],
      },
      ports: {
        inputs: [
          {
            id: "observedSum",
            label: "Observed Sum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedItems",
            label: "Observed Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expectedItems",
            label: "Expected Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "allowProration",
            label: "Allow Proration",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "missingItems",
            label: "Missing Items",
            valueType: { type: "integer" },
          },
          {
            id: "available",
            label: "Available",
            valueType: { type: "boolean" },
          },
          { id: "score", label: "Score", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = studentMotivationScaleMissingItemTermTool.execute;
export default studentMotivationScaleMissingItemTermTool;
