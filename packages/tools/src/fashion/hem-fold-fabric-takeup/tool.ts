import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly finishedLength: number;
  readonly foldDepth: number;
  readonly foldCount: number;
};
export type Output = {
  readonly cutLength: number;
  readonly totalTakeup: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finishedLength: { type: "number", minimum: 0 },
    foldDepth: { type: "number", minimum: 0 },
    foldCount: { type: "integer", minimum: 1, maximum: 4 },
  },
  required: ["finishedLength", "foldDepth", "foldCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cutLength: { type: "number" },
    totalTakeup: { type: "number" },
  },
  required: ["cutLength", "totalTakeup"],
} as const;
/** Add equal-depth hem folds to a finished linear garment dimension; no fabric stretch or shrinkage is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { finishedLength, foldDepth, foldCount } = request;
  const compute = (): Output => {
    H.domain(finishedLength >= 0 && foldDepth >= 0, "finishedLength");
    (H.domain(
      Number.isSafeInteger(foldCount) && foldCount >= 1 && foldCount <= 4,
      "foldCount",
    ),
      foldCount);
    return {
      cutLength: finishedLength + foldDepth * foldCount,
      totalTakeup: foldDepth * foldCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { finishedLength: 70, foldDepth: 2, foldCount: 2 },
  output: { cutLength: 74, totalTakeup: 4 },
} satisfies ToolExample<Input, Output>;
export const hemFoldFabricTakeupTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "fashion/hem-fold-fabric-takeup",
      title: "Hem Fold Fabric Takeup Tool",
      description:
        "Add equal-depth hem folds to a finished linear garment dimension; no fabric stretch or shrinkage is assumed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          finishedLength: { type: "number", minimum: 0 },
          foldDepth: { type: "number", minimum: 0 },
          foldCount: { type: "integer", minimum: 1, maximum: 4 },
        },
        required: ["finishedLength", "foldDepth", "foldCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cutLength: { type: "number" },
          totalTakeup: { type: "number" },
        },
        required: ["cutLength", "totalTakeup"],
      },
      ports: {
        inputs: [
          {
            id: "finishedLength",
            label: "Finished Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "foldDepth",
            label: "Fold Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "foldCount",
            label: "Fold Count",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "cutLength",
            label: "Cut Length",
            valueType: { type: "number" },
          },
          {
            id: "totalTakeup",
            label: "Total Takeup",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = hemFoldFabricTakeupTool.execute;
export default hemFoldFabricTakeupTool;
