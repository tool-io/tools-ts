import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly total: number;
  readonly classes: number;
  readonly classCount: number;
};
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer", minimum: 1 },
    classes: { type: "integer", minimum: 2 },
    classCount: { type: "integer", minimum: 1 },
  },
  required: ["total", "classes", "classCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Calculate class weight rebalancing multiplier from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { total, classes, classCount } = request;
  const compute = (): Output => {
    H.integer(total, 1);
    H.integer(classes, 2, total);
    H.integer(classCount, 1, total);
    return { weight: total / (classes * classCount) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { total: 100, classes: 2, classCount: 25 },
  output: { weight: 2 },
} satisfies ToolExample<Input, Output>;
export const classWeightRebalancingMultiplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/class-weight-rebalancing-multiplier",
    title: "Class Weight Rebalancing Multiplier Tool",
    description:
      "Calculate class weight rebalancing multiplier from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "integer", minimum: 1 },
        classes: { type: "integer", minimum: 2 },
        classCount: { type: "integer", minimum: 1 },
      },
      required: ["total", "classes", "classCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "classes",
          label: "Classes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "classCount",
          label: "Class Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = classWeightRebalancingMultiplierTool.execute;
export default classWeightRebalancingMultiplierTool;
