import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presetCount: number;
  readonly returnedCount: number;
};
export type Output = {
  readonly returnedMinusPreset: number;
  readonly missingCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presetCount: { type: "integer", minimum: 0 },
    returnedCount: { type: "integer", minimum: 0 },
  },
  required: ["presetCount", "returnedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedMinusPreset: { type: "integer" },
    missingCount: { type: "integer" },
  },
  required: ["returnedMinusPreset", "missingCount"],
} as const;
/** Compare explicit preset and returned prop counts, preserving extra returns as a positive discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presetCount, returnedCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(presetCount) &&
        presetCount >= 0 &&
        presetCount <= Number.MAX_SAFE_INTEGER,
      "presetCount",
    ),
      presetCount);
    (H.domain(
      Number.isSafeInteger(returnedCount) &&
        returnedCount >= 0 &&
        returnedCount <= Number.MAX_SAFE_INTEGER,
      "returnedCount",
    ),
      returnedCount);
    return {
      returnedMinusPreset: returnedCount - presetCount,
      missingCount: Math.max(0, presetCount - returnedCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presetCount: 12, returnedCount: 10 },
  output: { returnedMinusPreset: -2, missingCount: 2 },
} satisfies ToolExample<Input, Output>;
export const propPresetReturnQuantityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["performing-arts", "performing arts", "arts and design"],
      keywords: ["performing arts", "arts and design"],
    },
    id: "performing-arts/prop-preset-return-quantity-gap",
    title: "Prop Preset Return Quantity Gap",
    description:
      "Compare explicit preset and returned prop counts, preserving extra returns as a positive discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presetCount: { type: "integer", minimum: 0 },
        returnedCount: { type: "integer", minimum: 0 },
      },
      required: ["presetCount", "returnedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnedMinusPreset: { type: "integer" },
        missingCount: { type: "integer" },
      },
      required: ["returnedMinusPreset", "missingCount"],
    },
    ports: {
      inputs: [
        {
          id: "presetCount",
          label: "Preset Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedCount",
          label: "Returned Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "returnedMinusPreset",
          label: "Returned Minus Preset",
          valueType: { type: "integer" },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = propPresetReturnQuantityGapTool.execute;
export default propPresetReturnQuantityGapTool;
