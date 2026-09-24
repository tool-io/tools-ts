import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceIndices: readonly number[];
  readonly targetIndices: readonly number[];
  readonly weights: readonly number[];
  readonly nullIndex: number;
};
export type Output = {
  readonly totalWeight: number;
  readonly nullSourceWeight: number;
  readonly nullTargetWeight: number;
  readonly bothNullWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    targetIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    nullIndex: { type: "integer" },
  },
  required: ["sourceIndices", "targetIndices", "weights", "nullIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWeight: { type: "number" },
    nullSourceWeight: { type: "number" },
    nullTargetWeight: { type: "number" },
    bothNullWeight: { type: "number" },
  },
  required: [
    "totalWeight",
    "nullSourceWeight",
    "nullTargetWeight",
    "bothNullWeight",
  ],
} as const;
/** Account for supplied null-index alignment support on both sides without merging one-sided and double-null rows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIndices, targetIndices, weights, nullIndex } = request;
  const compute = (): Output => {
    H.sameLength(sourceIndices, targetIndices);
    H.sameLength(sourceIndices, weights);
    H.domain(weights.every((x) => x >= 0));
    return {
      totalWeight: weights.reduce((a, b) => a + b, 0),
      nullSourceWeight: weights.reduce(
        (s, x, i) => s + (sourceIndices[i] === nullIndex ? x : 0),
        0,
      ),
      nullTargetWeight: weights.reduce(
        (s, x, i) => s + (targetIndices[i] === nullIndex ? x : 0),
        0,
      ),
      bothNullWeight: weights.reduce(
        (s, x, i) =>
          s +
          (sourceIndices[i] === nullIndex && targetIndices[i] === nullIndex
            ? x
            : 0),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceIndices: [0, -1, -1],
    targetIndices: [1, 2, -1],
    weights: [2, 3, 1],
    nullIndex: -1,
  },
  output: {
    totalWeight: 6,
    nullSourceWeight: 4,
    nullTargetWeight: 1,
    bothNullWeight: 1,
  },
} satisfies ToolExample<Input, Output>;
export const alignmentNullSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/alignment-null-support-share",
    title: "Alignment Null Support Share Tool",
    description:
      "Account for supplied null-index alignment support on both sides without merging one-sided and double-null rows.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        targetIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        nullIndex: { type: "integer" },
      },
      required: ["sourceIndices", "targetIndices", "weights", "nullIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWeight: { type: "number" },
        nullSourceWeight: { type: "number" },
        nullTargetWeight: { type: "number" },
        bothNullWeight: { type: "number" },
      },
      required: [
        "totalWeight",
        "nullSourceWeight",
        "nullTargetWeight",
        "bothNullWeight",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sourceIndices",
          label: "Source Indices",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "targetIndices",
          label: "Target Indices",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "nullIndex",
          label: "Null Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "nullSourceWeight",
          label: "Null Source Weight",
          valueType: { type: "number" },
        },
        {
          id: "nullTargetWeight",
          label: "Null Target Weight",
          valueType: { type: "number" },
        },
        {
          id: "bothNullWeight",
          label: "Both Null Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = alignmentNullSupportShareTool.execute;
export default alignmentNullSupportShareTool;
