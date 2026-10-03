import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly versions: readonly number[];
  readonly effectiveDays: readonly number[];
};
export type Output = {
  readonly nonIncreasingVersionIndices: readonly number[];
  readonly decreasingDateIndices: readonly number[];
  readonly ordered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versions: { type: "array", maxItems: 256, items: { type: "integer" } },
    effectiveDays: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["versions", "effectiveDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonIncreasingVersionIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    decreasingDateIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    ordered: { type: "boolean" },
  },
  required: ["nonIncreasingVersionIndices", "decreasingDateIndices", "ordered"],
} as const;
/** Audit explicit version and effective-day ordering without selecting a current label. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { versions, effectiveDays } = request;
  const compute = (): Output => {
    H.sameLength(versions, effectiveDays);
    const nonIncreasingVersionIndices = versions.flatMap((x, i) =>
        i > 0 && x <= versions[i - 1] ? [i] : [],
      ),
      decreasingDateIndices = effectiveDays.flatMap((x, i) =>
        i > 0 && x < effectiveDays[i - 1] ? [i] : [],
      );
    return {
      nonIncreasingVersionIndices,
      decreasingDateIndices,
      ordered:
        nonIncreasingVersionIndices.length === 0 &&
        decreasingDateIndices.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { versions: [1, 2, 2], effectiveDays: [100, 110, 105] },
  output: {
    nonIncreasingVersionIndices: [2],
    decreasingDateIndices: [2],
    ordered: false,
  },
} satisfies ToolExample<Input, Output>;
export const regulatoryLabelVersionDateOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/regulatory-label-version-date-order",
    title: "Regulatory Label Version Date Order Tool",
    description:
      "Audit explicit version and effective-day ordering without selecting a current label.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versions: { type: "array", maxItems: 256, items: { type: "integer" } },
        effectiveDays: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["versions", "effectiveDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nonIncreasingVersionIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        decreasingDateIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        ordered: { type: "boolean" },
      },
      required: [
        "nonIncreasingVersionIndices",
        "decreasingDateIndices",
        "ordered",
      ],
    },
    ports: {
      inputs: [
        {
          id: "versions",
          label: "Versions",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "effectiveDays",
          label: "Effective Days",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "nonIncreasingVersionIndices",
          label: "Non Increasing Version Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "decreasingDateIndices",
          label: "Decreasing Date Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = regulatoryLabelVersionDateOrderTool.execute;
export default regulatoryLabelVersionDateOrderTool;
