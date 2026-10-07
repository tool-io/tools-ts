import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMinutes: number;
  readonly scheduledMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMinutes: { type: "number", minimum: 0 },
    scheduledMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedMinutes", "scheduledMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate supplied observed sampling duration as a fraction of a positive scheduled interval, plus unobserved remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMinutes, scheduledMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(scheduledMinutes) && scheduledMinutes > 0,
      "scheduledMinutes",
    ),
      scheduledMinutes);
    H.domain(
      observedMinutes >= 0 && observedMinutes <= scheduledMinutes,
      "observedMinutes",
    );
    return {
      fraction: observedMinutes / scheduledMinutes,
      remainder: scheduledMinutes - observedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMinutes: 30, scheduledMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const behaviorSamplingIntervalCoverageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/behavior-sampling-interval-coverage",
    title: "Behavior Sampling Interval Coverage",
    description:
      "Calculate supplied observed sampling duration as a fraction of a positive scheduled interval, plus unobserved remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMinutes: { type: "number", minimum: 0 },
        scheduledMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedMinutes", "scheduledMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduledMinutes",
          label: "Scheduled Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = behaviorSamplingIntervalCoverageTool.execute;
export default behaviorSamplingIntervalCoverageTool;
