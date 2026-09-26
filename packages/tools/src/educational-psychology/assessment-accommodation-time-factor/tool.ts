import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseMinutes: number;
  readonly multiplier: number;
  readonly extraFixedMinutes: number;
  readonly breaksMinutes: number;
};
export type Output = {
  readonly workingMinutes: number;
  readonly scheduledMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseMinutes: { type: "number", minimum: 0 },
    multiplier: { type: "number", exclusiveMinimum: 0 },
    extraFixedMinutes: { type: "number", minimum: 0 },
    breaksMinutes: { type: "number", minimum: 0 },
  },
  required: ["baseMinutes", "multiplier", "extraFixedMinutes", "breaksMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workingMinutes: { type: "number" },
    scheduledMinutes: { type: "number" },
  },
  required: ["workingMinutes", "scheduledMinutes"],
} as const;
/** Calculate assessment accommodation time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseMinutes, multiplier, extraFixedMinutes, breaksMinutes } = request;
  const compute = (): Output => {
    H.domain(baseMinutes >= 0 && extraFixedMinutes >= 0 && breaksMinutes >= 0);
    H.positive(multiplier);
    return {
      workingMinutes: baseMinutes * multiplier + extraFixedMinutes,
      scheduledMinutes:
        baseMinutes * multiplier + extraFixedMinutes + breaksMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseMinutes: 60,
    multiplier: 1.5,
    extraFixedMinutes: 10,
    breaksMinutes: 15,
  },
  output: { workingMinutes: 100, scheduledMinutes: 115 },
} satisfies ToolExample<Input, Output>;
export const assessmentAccommodationTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/assessment-accommodation-time-factor",
    title: "Assessment Accommodation Time Factor Tool",
    description:
      "Calculate assessment accommodation time factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseMinutes: { type: "number", minimum: 0 },
        multiplier: { type: "number", exclusiveMinimum: 0 },
        extraFixedMinutes: { type: "number", minimum: 0 },
        breaksMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "baseMinutes",
        "multiplier",
        "extraFixedMinutes",
        "breaksMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workingMinutes: { type: "number" },
        scheduledMinutes: { type: "number" },
      },
      required: ["workingMinutes", "scheduledMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "baseMinutes",
          label: "Base Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extraFixedMinutes",
          label: "Extra Fixed Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "breaksMinutes",
          label: "Breaks Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "workingMinutes",
          label: "Working Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "scheduledMinutes",
          label: "Scheduled Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = assessmentAccommodationTimeFactorTool.execute;
export default assessmentAccommodationTimeFactorTool;
