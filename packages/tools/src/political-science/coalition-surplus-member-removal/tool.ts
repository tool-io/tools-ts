import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly majority: number;
  readonly removedIndex: number;
};
export type Output = {
  readonly total: number;
  readonly afterRemoval: number;
  readonly removable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    majority: { type: "number", exclusiveMinimum: 0 },
    removedIndex: { type: "integer", minimum: 0 },
  },
  required: ["weights", "majority", "removedIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number" },
    afterRemoval: { type: "number" },
    removable: { type: "boolean" },
  },
  required: ["total", "afterRemoval", "removable"],
} as const;
/** Calculate coalition surplus member removal from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, majority, removedIndex } = request;
  const compute = (): Output => {
    H.domain(
      weights.length > 0 && weights.every((x) => x >= 0) && majority > 0,
    );
    H.integer(removedIndex, 0, weights.length - 1);
    return {
      total: weights.reduce((a, b) => a + b, 0),
      afterRemoval: weights.reduce((a, b) => a + b, 0) - weights[removedIndex],
      removable:
        weights.reduce((a, b) => a + b, 0) - weights[removedIndex] >= majority,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [30, 25, 10], majority: 51, removedIndex: 2 },
  output: { total: 65, afterRemoval: 55, removable: true },
} satisfies ToolExample<Input, Output>;
export const coalitionSurplusMemberRemovalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/coalition-surplus-member-removal",
    title: "Coalition Surplus Member Removal Tool",
    description:
      "Calculate coalition surplus member removal from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        majority: { type: "number", exclusiveMinimum: 0 },
        removedIndex: { type: "integer", minimum: 0 },
      },
      required: ["weights", "majority", "removedIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "number" },
        afterRemoval: { type: "number" },
        removable: { type: "boolean" },
      },
      required: ["total", "afterRemoval", "removable"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "majority",
          label: "Majority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedIndex",
          label: "Removed Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "total", label: "Total", valueType: { type: "number" } },
        {
          id: "afterRemoval",
          label: "After Removal",
          valueType: { type: "number" },
        },
        { id: "removable", label: "Removable", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = coalitionSurplusMemberRemovalTool.execute;
export default coalitionSurplusMemberRemovalTool;
