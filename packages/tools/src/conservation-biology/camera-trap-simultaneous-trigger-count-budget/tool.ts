import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTriggers: number;
  readonly secondTriggers: number;
  readonly pairedSimultaneous: number;
};
export type Output = {
  readonly uniqueEvents: number;
  readonly duplicateRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTriggers: { type: "integer", minimum: 0 },
    secondTriggers: { type: "integer", minimum: 0 },
    pairedSimultaneous: { type: "integer", minimum: 0 },
  },
  required: ["firstTriggers", "secondTriggers", "pairedSimultaneous"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueEvents: { type: "integer" },
    duplicateRecords: { type: "integer" },
  },
  required: ["uniqueEvents", "duplicateRecords"],
} as const;
/** Deduplicate caller-paired trigger records without deciding species detections or independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTriggers, secondTriggers, pairedSimultaneous } = request;
  const compute = (): Output => {
    H.integer(firstTriggers, 0);
    H.integer(secondTriggers, 0);
    H.integer(pairedSimultaneous, 0, Math.min(firstTriggers, secondTriggers));
    return {
      uniqueEvents: firstTriggers + secondTriggers - pairedSimultaneous,
      duplicateRecords: pairedSimultaneous,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTriggers: 12, secondTriggers: 10, pairedSimultaneous: 4 },
  output: { uniqueEvents: 18, duplicateRecords: 4 },
} satisfies ToolExample<Input, Output>;
export const cameraTrapSimultaneousTriggerCountBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "conservation-biology/camera-trap-simultaneous-trigger-count-budget",
      title: "Camera Trap Simultaneous Trigger Count Budget Tool",
      description:
        "Deduplicate caller-paired trigger records without deciding species detections or independence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstTriggers: { type: "integer", minimum: 0 },
          secondTriggers: { type: "integer", minimum: 0 },
          pairedSimultaneous: { type: "integer", minimum: 0 },
        },
        required: ["firstTriggers", "secondTriggers", "pairedSimultaneous"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniqueEvents: { type: "integer" },
          duplicateRecords: { type: "integer" },
        },
        required: ["uniqueEvents", "duplicateRecords"],
      },
      ports: {
        inputs: [
          {
            id: "firstTriggers",
            label: "First Triggers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondTriggers",
            label: "Second Triggers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "pairedSimultaneous",
            label: "Paired Simultaneous",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "uniqueEvents",
            label: "Unique Events",
            valueType: { type: "integer" },
          },
          {
            id: "duplicateRecords",
            label: "Duplicate Records",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cameraTrapSimultaneousTriggerCountBudgetTool.execute;
export default cameraTrapSimultaneousTriggerCountBudgetTool;
