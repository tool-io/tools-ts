import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly nominalInterval: number;
};
export type Output = {
  readonly observedInterval: number;
  readonly signedJitter: number;
  readonly relativeJitter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    nominalInterval: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstTime", "secondTime", "nominalInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedInterval: { type: "number" },
    signedJitter: { type: "number" },
    relativeJitter: { type: "number" },
  },
  required: ["observedInterval", "signedJitter", "relativeJitter"],
} as const;
/** Compare supplied adjacent research sample timestamps to a positive nominal interval without inferring a rhythm disorder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, nominalInterval } = request;
  const compute = (): Output => {
    H.positive(nominalInterval);
    return {
      observedInterval: secondTime - firstTime,
      signedJitter: secondTime - firstTime - nominalInterval,
      relativeJitter:
        (secondTime - firstTime - nominalInterval) / nominalInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTime: 10, secondTime: 13, nominalInterval: 2 },
  output: { observedInterval: 3, signedJitter: 1, relativeJitter: 0.5 },
} satisfies ToolExample<Input, Output>;
export const sampleIntervalJitterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/sample-interval-jitter",
    title: "Sample Interval Jitter Tool",
    description:
      "Compare supplied adjacent research sample timestamps to a positive nominal interval without inferring a rhythm disorder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        nominalInterval: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstTime", "secondTime", "nominalInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedInterval: { type: "number" },
        signedJitter: { type: "number" },
        relativeJitter: { type: "number" },
      },
      required: ["observedInterval", "signedJitter", "relativeJitter"],
    },
    ports: {
      inputs: [
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nominalInterval",
          label: "Nominal Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedInterval",
          label: "Observed Interval",
          valueType: { type: "number" },
        },
        {
          id: "signedJitter",
          label: "Signed Jitter",
          valueType: { type: "number" },
        },
        {
          id: "relativeJitter",
          label: "Relative Jitter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleIntervalJitterTool.execute;
export default sampleIntervalJitterTool;
