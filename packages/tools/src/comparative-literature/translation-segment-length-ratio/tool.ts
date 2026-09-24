import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceLength: number;
  readonly targetLength: number;
  readonly excludeSource: number;
  readonly excludeTarget: number;
};
export type Output = {
  readonly ratio: number;
  readonly sourceBase: number;
  readonly targetBase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceLength: { type: "integer", minimum: 1 },
    targetLength: { type: "integer", minimum: 0 },
    excludeSource: { type: "integer", minimum: 0 },
    excludeTarget: { type: "integer", minimum: 0 },
  },
  required: ["sourceLength", "targetLength", "excludeSource", "excludeTarget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    sourceBase: { type: "integer" },
    targetBase: { type: "integer" },
  },
  required: ["ratio", "sourceBase", "targetBase"],
} as const;
/** Compare supplied segment lengths in compatible counting units without judging translation quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceLength, targetLength, excludeSource, excludeTarget } = request;
  const compute = (): Output => {
    H.integer(sourceLength, 1);
    H.integer(targetLength, 0);
    H.integer(excludeSource, 0, sourceLength - 1);
    H.integer(excludeTarget, 0, targetLength);
    return {
      ratio: (targetLength - excludeTarget) / (sourceLength - excludeSource),
      sourceBase: sourceLength - excludeSource,
      targetBase: targetLength - excludeTarget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceLength: 100,
    targetLength: 120,
    excludeSource: 20,
    excludeTarget: 10,
  },
  output: { ratio: 1.375, sourceBase: 80, targetBase: 110 },
} satisfies ToolExample<Input, Output>;
export const translationSegmentLengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/translation-segment-length-ratio",
    title: "Translation Segment Length Ratio Tool",
    description:
      "Compare supplied segment lengths in compatible counting units without judging translation quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceLength: { type: "integer", minimum: 1 },
        targetLength: { type: "integer", minimum: 0 },
        excludeSource: { type: "integer", minimum: 0 },
        excludeTarget: { type: "integer", minimum: 0 },
      },
      required: [
        "sourceLength",
        "targetLength",
        "excludeSource",
        "excludeTarget",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        sourceBase: { type: "integer" },
        targetBase: { type: "integer" },
      },
      required: ["ratio", "sourceBase", "targetBase"],
    },
    ports: {
      inputs: [
        {
          id: "sourceLength",
          label: "Source Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetLength",
          label: "Target Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeSource",
          label: "Exclude Source",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeTarget",
          label: "Exclude Target",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "sourceBase",
          label: "Source Base",
          valueType: { type: "integer" },
        },
        {
          id: "targetBase",
          label: "Target Base",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = translationSegmentLengthRatioTool.execute;
export default translationSegmentLengthRatioTool;
