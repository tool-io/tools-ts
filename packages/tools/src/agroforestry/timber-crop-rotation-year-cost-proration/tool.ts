import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cost: number;
  readonly cropYears: number;
  readonly treeYears: number;
  readonly sharedFraction: number;
};
export type Output = {
  readonly cropAllocated: number;
  readonly treeAllocated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cost: { type: "number", minimum: 0 },
    cropYears: { type: "number", minimum: 0 },
    treeYears: { type: "number", minimum: 0 },
    sharedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["cost", "cropYears", "treeYears", "sharedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cropAllocated: { type: "number" },
    treeAllocated: { type: "number" },
  },
  required: ["cropAllocated", "treeAllocated"],
} as const;
/** Calculate timber crop rotation year cost proration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cost, cropYears, treeYears, sharedFraction } = request;
  const compute = (): Output => {
    H.domain(
      cost >= 0 &&
        cropYears >= 0 &&
        treeYears >= 0 &&
        cropYears + treeYears > 0,
    );
    H.probability(sharedFraction);
    return {
      cropAllocated:
        (cost * sharedFraction * cropYears) / (cropYears + treeYears),
      treeAllocated:
        (cost * sharedFraction * treeYears) / (cropYears + treeYears),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cost: 1000, cropYears: 2, treeYears: 8, sharedFraction: 0.5 },
  output: { cropAllocated: 100, treeAllocated: 400 },
} satisfies ToolExample<Input, Output>;
export const timberCropRotationYearCostProrationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroforestry/timber-crop-rotation-year-cost-proration",
      title: "Timber Crop Rotation Year Cost Proration Tool",
      description:
        "Calculate timber crop rotation year cost proration from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cost: { type: "number", minimum: 0 },
          cropYears: { type: "number", minimum: 0 },
          treeYears: { type: "number", minimum: 0 },
          sharedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["cost", "cropYears", "treeYears", "sharedFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cropAllocated: { type: "number" },
          treeAllocated: { type: "number" },
        },
        required: ["cropAllocated", "treeAllocated"],
      },
      ports: {
        inputs: [
          {
            id: "cost",
            label: "Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cropYears",
            label: "Crop Years",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "treeYears",
            label: "Tree Years",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sharedFraction",
            label: "Shared Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "cropAllocated",
            label: "Crop Allocated",
            valueType: { type: "number" },
          },
          {
            id: "treeAllocated",
            label: "Tree Allocated",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = timberCropRotationYearCostProrationTool.execute;
export default timberCropRotationYearCostProrationTool;
