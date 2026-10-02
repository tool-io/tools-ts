import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceX: number;
  readonly sourceY: number;
  readonly targetX: number;
  readonly targetY: number;
};
export type Output = {
  readonly areaRatio: number;
  readonly xRatio: number;
  readonly yRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceX: { type: "number", exclusiveMinimum: 0 },
    sourceY: { type: "number", exclusiveMinimum: 0 },
    targetX: { type: "number", exclusiveMinimum: 0 },
    targetY: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceX", "sourceY", "targetX", "targetY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaRatio: { type: "number" },
    xRatio: { type: "number" },
    yRatio: { type: "number" },
  },
  required: ["areaRatio", "xRatio", "yRatio"],
} as const;
/** Calculate precision grid resolution mismatch factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceX, sourceY, targetX, targetY } = request;
  const compute = (): Output => {
    H.positive(sourceX);
    H.positive(sourceY);
    H.positive(targetX);
    H.positive(targetY);
    return {
      areaRatio: (targetX * targetY) / (sourceX * sourceY),
      xRatio: targetX / sourceX,
      yRatio: targetY / sourceY,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceX: 2, sourceY: 3, targetX: 4, targetY: 6 },
  output: { areaRatio: 4, xRatio: 2, yRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const precisionGridResolutionMismatchFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "precision-agriculture/precision-grid-resolution-mismatch-factor",
      title: "Precision Grid Resolution Mismatch Factor Tool",
      description:
        "Calculate precision grid resolution mismatch factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceX: { type: "number", exclusiveMinimum: 0 },
          sourceY: { type: "number", exclusiveMinimum: 0 },
          targetX: { type: "number", exclusiveMinimum: 0 },
          targetY: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["sourceX", "sourceY", "targetX", "targetY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areaRatio: { type: "number" },
          xRatio: { type: "number" },
          yRatio: { type: "number" },
        },
        required: ["areaRatio", "xRatio", "yRatio"],
      },
      ports: {
        inputs: [
          {
            id: "sourceX",
            label: "Source X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceY",
            label: "Source Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetX",
            label: "Target X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetY",
            label: "Target Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "areaRatio",
            label: "Area Ratio",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "xRatio",
            label: "X Ratio",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "yRatio",
            label: "Y Ratio",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = precisionGridResolutionMismatchFactorTool.execute;
export default precisionGridResolutionMismatchFactorTool;
