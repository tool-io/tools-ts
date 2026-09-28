import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceBatch: number;
  readonly targetBatch: number;
  readonly referenceComponent: number;
  readonly fixedLoss: number;
};
export type Output = {
  readonly scale: number;
  readonly proportionalComponent: number;
  readonly totalRequired: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceBatch: { type: "number", exclusiveMinimum: 0 },
    targetBatch: { type: "number", minimum: 0 },
    referenceComponent: { type: "number", minimum: 0 },
    fixedLoss: { type: "number", minimum: 0 },
  },
  required: [
    "referenceBatch",
    "targetBatch",
    "referenceComponent",
    "fixedLoss",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scale: { type: "number" },
    proportionalComponent: { type: "number" },
    totalRequired: { type: "number" },
  },
  required: ["scale", "proportionalComponent", "totalRequired"],
} as const;
/** Calculate gmp batch size scale one component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceBatch, targetBatch, referenceComponent, fixedLoss } =
    request;
  const compute = (): Output => {
    H.positive(referenceBatch);
    H.domain(targetBatch >= 0 && referenceComponent >= 0 && fixedLoss >= 0);
    return {
      scale: targetBatch / referenceBatch,
      proportionalComponent:
        (referenceComponent * targetBatch) / referenceBatch,
      totalRequired:
        (referenceComponent * targetBatch) / referenceBatch + fixedLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceBatch: 100,
    targetBatch: 250,
    referenceComponent: 20,
    fixedLoss: 2,
  },
  output: { scale: 2.5, proportionalComponent: 50, totalRequired: 52 },
} satisfies ToolExample<Input, Output>;
export const gmpBatchSizeScaleOneComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-batch-size-scale-one-component",
    title: "GMP Batch Size Scale One Component Tool",
    description:
      "Calculate gmp batch size scale one component from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceBatch: { type: "number", exclusiveMinimum: 0 },
        targetBatch: { type: "number", minimum: 0 },
        referenceComponent: { type: "number", minimum: 0 },
        fixedLoss: { type: "number", minimum: 0 },
      },
      required: [
        "referenceBatch",
        "targetBatch",
        "referenceComponent",
        "fixedLoss",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scale: { type: "number" },
        proportionalComponent: { type: "number" },
        totalRequired: { type: "number" },
      },
      required: ["scale", "proportionalComponent", "totalRequired"],
    },
    ports: {
      inputs: [
        {
          id: "referenceBatch",
          label: "Reference Batch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBatch",
          label: "Target Batch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceComponent",
          label: "Reference Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedLoss",
          label: "Fixed Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "scale", label: "Scale", valueType: { type: "number" } },
        {
          id: "proportionalComponent",
          label: "Proportional Component",
          valueType: { type: "number" },
        },
        {
          id: "totalRequired",
          label: "Total Required",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpBatchSizeScaleOneComponentTool.execute;
export default gmpBatchSizeScaleOneComponentTool;
