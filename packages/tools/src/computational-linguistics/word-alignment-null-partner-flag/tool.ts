import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceIndex: number;
  readonly targetIndex: number;
  readonly nullTargetIndex: number;
};
export type Output = {
  readonly nullAligned: boolean;
  readonly alignment: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceIndex: { type: "integer", minimum: 0 },
    targetIndex: { type: "integer", minimum: -1 },
    nullTargetIndex: { type: "integer", minimum: -1 },
  },
  required: ["sourceIndex", "targetIndex", "nullTargetIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nullAligned: { type: "boolean" },
    alignment: { type: "string", maxLength: 8192 },
  },
  required: ["nullAligned", "alignment"],
} as const;
/** Flag a supplied null-partner alignment convention without discovering word correspondences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIndex, targetIndex, nullTargetIndex } = request;
  const compute = (): Output => {
    H.integer(sourceIndex, 0);
    H.integer(targetIndex, -1);
    H.integer(nullTargetIndex, -1);
    return {
      nullAligned: targetIndex === nullTargetIndex,
      alignment: JSON.stringify([sourceIndex, targetIndex]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceIndex: 2, targetIndex: -1, nullTargetIndex: -1 },
  output: { nullAligned: true, alignment: "[2,-1]" },
} satisfies ToolExample<Input, Output>;
export const wordAlignmentNullPartnerFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/word-alignment-null-partner-flag",
    title: "Word Alignment Null Partner Flag Tool",
    description:
      "Flag a supplied null-partner alignment convention without discovering word correspondences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceIndex: { type: "integer", minimum: 0 },
        targetIndex: { type: "integer", minimum: -1 },
        nullTargetIndex: { type: "integer", minimum: -1 },
      },
      required: ["sourceIndex", "targetIndex", "nullTargetIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nullAligned: { type: "boolean" },
        alignment: { type: "string", maxLength: 8192 },
      },
      required: ["nullAligned", "alignment"],
    },
    ports: {
      inputs: [
        {
          id: "sourceIndex",
          label: "Source Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetIndex",
          label: "Target Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nullTargetIndex",
          label: "Null Target Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nullAligned",
          label: "Null Aligned",
          valueType: { type: "boolean" },
        },
        { id: "alignment", label: "Alignment", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = wordAlignmentNullPartnerFlagTool.execute;
export default wordAlignmentNullPartnerFlagTool;
