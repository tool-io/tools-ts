import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawScore: number;
  readonly severityOffset: number;
  readonly floor: number;
  readonly ceiling: number;
  readonly clamp: boolean;
};
export type Output = {
  readonly adjusted: number;
  readonly wasClamped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawScore: { type: "number" },
    severityOffset: { type: "number" },
    floor: { type: "number" },
    ceiling: { type: "number" },
    clamp: { type: "boolean" },
  },
  required: ["rawScore", "severityOffset", "floor", "ceiling", "clamp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjusted: { type: "number" }, wasClamped: { type: "boolean" } },
  required: ["adjusted", "wasClamped"],
} as const;
/** Apply a supplied additive severity correction; this does not estimate a rater model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawScore, severityOffset, floor, ceiling, clamp } = request;
  const compute = (): Output => {
    H.domain(ceiling > floor && rawScore >= floor && rawScore <= ceiling);
    return {
      adjusted: clamp
        ? Math.max(floor, Math.min(ceiling, rawScore + severityOffset))
        : rawScore + severityOffset,
      wasClamped:
        clamp &&
        (rawScore + severityOffset < floor ||
          rawScore + severityOffset > ceiling),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rawScore: 3,
    severityOffset: 0.5,
    floor: 0,
    ceiling: 4,
    clamp: true,
  },
  output: { adjusted: 3.5, wasClamped: false },
} satisfies ToolExample<Input, Output>;
export const rubricRaterSeveritySuppliedOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/rubric-rater-severity-supplied-offset",
    title: "Rubric Rater Severity Supplied Offset Tool",
    description:
      "Apply a supplied additive severity correction; this does not estimate a rater model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawScore: { type: "number" },
        severityOffset: { type: "number" },
        floor: { type: "number" },
        ceiling: { type: "number" },
        clamp: { type: "boolean" },
      },
      required: ["rawScore", "severityOffset", "floor", "ceiling", "clamp"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjusted: { type: "number" },
        wasClamped: { type: "boolean" },
      },
      required: ["adjusted", "wasClamped"],
    },
    ports: {
      inputs: [
        {
          id: "rawScore",
          label: "Raw Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "severityOffset",
          label: "Severity Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floor",
          label: "Floor",
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
          id: "clamp",
          label: "Clamp",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "adjusted", label: "Adjusted", valueType: { type: "number" } },
        {
          id: "wasClamped",
          label: "Was Clamped",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = rubricRaterSeveritySuppliedOffsetTool.execute;
export default rubricRaterSeveritySuppliedOffsetTool;
