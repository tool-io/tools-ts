import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly recorded: number;
  readonly resolution: number;
  readonly truncated: boolean;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly deviationLower: number;
  readonly deviationUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "number" },
    recorded: { type: "number" },
    resolution: { type: "number", exclusiveMinimum: 0 },
    truncated: { type: "boolean" },
  },
  required: ["scheduled", "recorded", "resolution", "truncated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    deviationLower: { type: "number" },
    deviationUpper: { type: "number" },
  },
  required: ["lower", "upper", "deviationLower", "deviationUpper"],
} as const;
/** Propagate a supplied sampling timestamp quantum without deciding protocol compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, recorded, resolution, truncated } = request;
  const compute = (): Output => {
    H.positive(resolution);
    return {
      lower: recorded - (truncated ? 0 : resolution / 2),
      upper: recorded + (truncated ? resolution : resolution / 2),
      deviationLower: recorded - (truncated ? 0 : resolution / 2) - scheduled,
      deviationUpper:
        recorded + (truncated ? resolution : resolution / 2) - scheduled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduled: 10, recorded: 11, resolution: 2, truncated: false },
  output: { lower: 10, upper: 12, deviationLower: 0, deviationUpper: 2 },
} satisfies ToolExample<Input, Output>;
export const samplingTimePrecisionWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/sampling-time-precision-window",
    title: "Sampling Time Precision Window Tool",
    description:
      "Propagate a supplied sampling timestamp quantum without deciding protocol compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduled: { type: "number" },
        recorded: { type: "number" },
        resolution: { type: "number", exclusiveMinimum: 0 },
        truncated: { type: "boolean" },
      },
      required: ["scheduled", "recorded", "resolution", "truncated"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        deviationLower: { type: "number" },
        deviationUpper: { type: "number" },
      },
      required: ["lower", "upper", "deviationLower", "deviationUpper"],
    },
    ports: {
      inputs: [
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resolution",
          label: "Resolution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "truncated",
          label: "Truncated",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "deviationLower",
          label: "Deviation Lower",
          valueType: { type: "number" },
        },
        {
          id: "deviationUpper",
          label: "Deviation Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = samplingTimePrecisionWindowTool.execute;
export default samplingTimePrecisionWindowTool;
