import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceOnset: number;
  readonly targetOnset: number;
  readonly suppliedTargetClockOffset: number;
};
export type Output = { readonly alignmentOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceOnset: { type: "number" },
    targetOnset: { type: "number" },
    suppliedTargetClockOffset: { type: "number" },
  },
  required: ["sourceOnset", "targetOnset", "suppliedTargetClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { alignmentOffset: { type: "number" } },
  required: ["alignmentOffset"],
} as const;
/** Compare supplied research segment timestamps without phonetic segmentation or clinical scoring. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceOnset, targetOnset, suppliedTargetClockOffset } = request;
  const compute = (): Output => {
    return {
      alignmentOffset: targetOnset - suppliedTargetClockOffset - sourceOnset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceOnset: 10, targetOnset: 15, suppliedTargetClockOffset: 2 },
  output: { alignmentOffset: 3 },
} satisfies ToolExample<Input, Output>;
export const speechSegmentAlignmentOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/speech-segment-alignment-offset",
    title: "Speech Segment Alignment Offset Tool",
    description:
      "Compare supplied research segment timestamps without phonetic segmentation or clinical scoring.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceOnset: { type: "number" },
        targetOnset: { type: "number" },
        suppliedTargetClockOffset: { type: "number" },
      },
      required: ["sourceOnset", "targetOnset", "suppliedTargetClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { alignmentOffset: { type: "number" } },
      required: ["alignmentOffset"],
    },
    ports: {
      inputs: [
        {
          id: "sourceOnset",
          label: "Source Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetOnset",
          label: "Target Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTargetClockOffset",
          label: "Supplied Target Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "alignmentOffset",
          label: "Alignment Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechSegmentAlignmentOffsetTool.execute;
export default speechSegmentAlignmentOffsetTool;
