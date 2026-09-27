import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIndex: number;
  readonly secondIndex: number;
  readonly frameRate: number;
  readonly missingFrameCount: number;
};
export type Output = {
  readonly indexGap: number;
  readonly elapsedSeconds: number;
  readonly missingSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIndex: { type: "integer" },
    secondIndex: { type: "integer" },
    frameRate: { type: "number", exclusiveMinimum: 0 },
    missingFrameCount: { type: "integer", minimum: 0 },
  },
  required: ["firstIndex", "secondIndex", "frameRate", "missingFrameCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indexGap: { type: "integer" },
    elapsedSeconds: { type: "number" },
    missingSeconds: { type: "number" },
  },
  required: ["indexGap", "elapsedSeconds", "missingSeconds"],
} as const;
/** Inspect supplied image-sequence indices and missing-frame counts without image interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstIndex, secondIndex, frameRate, missingFrameCount } = request;
  const compute = (): Output => {
    H.positive(frameRate);
    H.domain(secondIndex >= firstIndex);
    H.integer(missingFrameCount, 0, Math.max(0, secondIndex - firstIndex - 1));
    return {
      indexGap: secondIndex - firstIndex,
      elapsedSeconds: (secondIndex - firstIndex) / frameRate,
      missingSeconds: missingFrameCount / frameRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstIndex: 10,
    secondIndex: 40,
    frameRate: 30,
    missingFrameCount: 3,
  },
  output: { indexGap: 30, elapsedSeconds: 1, missingSeconds: 0.1 },
} satisfies ToolExample<Input, Output>;
export const imageSequenceFrameGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/image-sequence-frame-gap",
    title: "Image Sequence Frame Gap Tool",
    description:
      "Inspect supplied image-sequence indices and missing-frame counts without image interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIndex: { type: "integer" },
        secondIndex: { type: "integer" },
        frameRate: { type: "number", exclusiveMinimum: 0 },
        missingFrameCount: { type: "integer", minimum: 0 },
      },
      required: ["firstIndex", "secondIndex", "frameRate", "missingFrameCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexGap: { type: "integer" },
        elapsedSeconds: { type: "number" },
        missingSeconds: { type: "number" },
      },
      required: ["indexGap", "elapsedSeconds", "missingSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondIndex",
          label: "Second Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameRate",
          label: "Frame Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingFrameCount",
          label: "Missing Frame Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "indexGap", label: "Index Gap", valueType: { type: "integer" } },
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          valueType: { type: "number" },
        },
        {
          id: "missingSeconds",
          label: "Missing Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = imageSequenceFrameGapTool.execute;
export default imageSequenceFrameGapTool;
