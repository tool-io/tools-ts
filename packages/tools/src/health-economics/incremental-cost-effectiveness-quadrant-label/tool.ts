import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly newCost: number;
  readonly oldCost: number;
  readonly newEffect: number;
  readonly oldEffect: number;
};
export type Output = {
  readonly costDifference: number;
  readonly effectDifference: number;
  readonly region: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newCost: { type: "number" },
    oldCost: { type: "number" },
    newEffect: { type: "number" },
    oldEffect: { type: "number" },
  },
  required: ["newCost", "oldCost", "newEffect", "oldEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costDifference: { type: "number" },
    effectDifference: { type: "number" },
    region: { type: "string", maxLength: 8192 },
  },
  required: ["costDifference", "effectDifference", "region"],
} as const;
/** Cost on the vertical axis and benefit on the horizontal axis; equal values receive explicit axis labels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { newCost, oldCost, newEffect, oldEffect } = request;
  const compute = (): Output => {
    return {
      costDifference: newCost - oldCost,
      effectDifference: newEffect - oldEffect,
      region:
        newCost === oldCost && newEffect === oldEffect
          ? "origin"
          : newCost === oldCost
            ? "effect-axis"
            : newEffect === oldEffect
              ? "cost-axis"
              : newCost > oldCost
                ? newEffect > oldEffect
                  ? "northeast"
                  : "northwest"
                : newEffect > oldEffect
                  ? "southeast"
                  : "southwest",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { newCost: 12000, oldCost: 10000, newEffect: 2, oldEffect: 1 },
  output: { costDifference: 2000, effectDifference: 1, region: "northeast" },
} satisfies ToolExample<Input, Output>;
export const incrementalCostEffectivenessQuadrantLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/incremental-cost-effectiveness-quadrant-label",
      title: "Incremental Cost Effectiveness Quadrant Label Tool",
      description:
        "Cost on the vertical axis and benefit on the horizontal axis; equal values receive explicit axis labels.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newCost: { type: "number" },
          oldCost: { type: "number" },
          newEffect: { type: "number" },
          oldEffect: { type: "number" },
        },
        required: ["newCost", "oldCost", "newEffect", "oldEffect"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          costDifference: { type: "number" },
          effectDifference: { type: "number" },
          region: { type: "string", maxLength: 8192 },
        },
        required: ["costDifference", "effectDifference", "region"],
      },
      ports: {
        inputs: [
          {
            id: "newCost",
            label: "New Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldCost",
            label: "Old Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newEffect",
            label: "New Effect",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldEffect",
            label: "Old Effect",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "costDifference",
            label: "Cost Difference",
            valueType: { type: "number" },
          },
          {
            id: "effectDifference",
            label: "Effect Difference",
            valueType: { type: "number" },
          },
          { id: "region", label: "Region", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = incrementalCostEffectivenessQuadrantLabelTool.execute;
export default incrementalCostEffectivenessQuadrantLabelTool;
