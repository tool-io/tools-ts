import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pre: number;
  readonly post: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = {
  readonly rawGain: number;
  readonly normalizedGain: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pre: { type: "number" },
    post: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["pre", "post", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawGain: { type: "number" },
    normalizedGain: { type: "number" },
  },
  required: ["rawGain", "normalizedGain"],
} as const;
/** Calculate farmer training pre post score gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pre, post, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(
      maximum > minimum &&
        pre >= minimum &&
        pre <= maximum &&
        post >= minimum &&
        post <= maximum,
    );
    return {
      rawGain: post - pre,
      normalizedGain: (post - pre) / (maximum - minimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pre: 4, post: 7, minimum: 0, maximum: 10 },
  output: { rawGain: 3, normalizedGain: 0.3 },
} satisfies ToolExample<Input, Output>;
export const farmerTrainingPrePostScoreGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/farmer-training-pre-post-score-gap",
    title: "Farmer Training Pre Post Score Gap Tool",
    description:
      "Calculate farmer training pre post score gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pre: { type: "number" },
        post: { type: "number" },
        minimum: { type: "number" },
        maximum: { type: "number" },
      },
      required: ["pre", "post", "minimum", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawGain: { type: "number" },
        normalizedGain: { type: "number" },
      },
      required: ["rawGain", "normalizedGain"],
    },
    ports: {
      inputs: [
        {
          id: "pre",
          label: "Pre",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "post",
          label: "Post",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawGain", label: "Raw Gain", valueType: { type: "number" } },
        {
          id: "normalizedGain",
          label: "Normalized Gain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmerTrainingPrePostScoreGapTool.execute;
export default farmerTrainingPrePostScoreGapTool;
