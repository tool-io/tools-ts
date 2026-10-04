import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeVolume: number;
  readonly removedVolume: number;
};
export type Output = {
  readonly remainingVolume: number;
  readonly removedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeVolume: { type: "number", exclusiveMinimum: 0 },
    removedVolume: { type: "number", minimum: 0 },
  },
  required: ["beforeVolume", "removedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingVolume: { type: "number" },
    removedFraction: { type: "number" },
  },
  required: ["remainingVolume", "removedFraction"],
} as const;
/** Record one sampling loss from a process volume without estimating biological yield or growth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeVolume, removedVolume } = request;
  const compute = (): Output => {
    (H.domain(beforeVolume > 0, "beforeVolume"), beforeVolume);
    H.domain(
      removedVolume >= 0 && removedVolume <= beforeVolume,
      "removedVolume",
    );
    return {
      remainingVolume: beforeVolume - removedVolume,
      removedFraction: removedVolume / beforeVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeVolume: 100, removedVolume: 5 },
  output: { remainingVolume: 95, removedFraction: 0.05 },
} satisfies ToolExample<Input, Output>;
export const bioProcessSingleSampleVolumeLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/bio-process-single-sample-volume-loss",
    title: "Bio Process Single Sample Volume Loss Tool",
    description:
      "Record one sampling loss from a process volume without estimating biological yield or growth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeVolume: { type: "number", exclusiveMinimum: 0 },
        removedVolume: { type: "number", minimum: 0 },
      },
      required: ["beforeVolume", "removedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingVolume: { type: "number" },
        removedFraction: { type: "number" },
      },
      required: ["remainingVolume", "removedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "beforeVolume",
          label: "Before Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedVolume",
          label: "Removed Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingVolume",
          label: "Remaining Volume",
          valueType: { type: "number" },
        },
        {
          id: "removedFraction",
          label: "Removed Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioProcessSingleSampleVolumeLossTool.execute;
export default bioProcessSingleSampleVolumeLossTool;
