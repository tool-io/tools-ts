import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pretest: number;
  readonly posttest: number;
  readonly ceiling: number;
  readonly floor: number;
};
export type Output = {
  readonly rawGain: number;
  readonly availableGain: number;
  readonly normalizedGain: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pretest: { type: "number" },
    posttest: { type: "number" },
    ceiling: { type: "number" },
    floor: { type: "number" },
  },
  required: ["pretest", "posttest", "ceiling", "floor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawGain: { type: "number" },
    availableGain: { type: "number" },
    normalizedGain: { type: "number" },
  },
  required: ["rawGain", "availableGain", "normalizedGain"],
} as const;
/** Calculate learning gain pretest ceiling gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pretest, posttest, ceiling, floor } = request;
  const compute = (): Output => {
    H.domain(
      ceiling > floor &&
        pretest >= floor &&
        pretest < ceiling &&
        posttest >= floor &&
        posttest <= ceiling,
    );
    return {
      rawGain: posttest - pretest,
      availableGain: ceiling - pretest,
      normalizedGain: (posttest - pretest) / (ceiling - pretest),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pretest: 40, posttest: 70, ceiling: 100, floor: 0 },
  output: { rawGain: 30, availableGain: 60, normalizedGain: 0.5 },
} satisfies ToolExample<Input, Output>;
export const learningGainPretestCeilingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/learning-gain-pretest-ceiling-gap",
    title: "Learning Gain Pretest Ceiling Gap Tool",
    description:
      "Calculate learning gain pretest ceiling gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pretest: { type: "number" },
        posttest: { type: "number" },
        ceiling: { type: "number" },
        floor: { type: "number" },
      },
      required: ["pretest", "posttest", "ceiling", "floor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawGain: { type: "number" },
        availableGain: { type: "number" },
        normalizedGain: { type: "number" },
      },
      required: ["rawGain", "availableGain", "normalizedGain"],
    },
    ports: {
      inputs: [
        {
          id: "pretest",
          label: "Pretest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "posttest",
          label: "Posttest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ceiling",
          label: "Ceiling",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floor",
          label: "Floor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawGain", label: "Raw Gain", valueType: { type: "number" } },
        {
          id: "availableGain",
          label: "Available Gain",
          valueType: { type: "number" },
        },
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
export const run = learningGainPretestCeilingGapTool.execute;
export default learningGainPretestCeilingGapTool;
