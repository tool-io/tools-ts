import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pulseWidth: number;
  readonly period: number;
  readonly pulseCount: number;
};
export type Output = {
  readonly dutyFraction: number;
  readonly totalOnTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pulseWidth: { type: "number", minimum: 0 },
    period: { type: "number", exclusiveMinimum: 0 },
    pulseCount: { type: "integer", minimum: 0 },
  },
  required: ["pulseWidth", "period", "pulseCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dutyFraction: { type: "number" },
    totalOnTime: { type: "number" },
  },
  required: ["dutyFraction", "totalOnTime"],
} as const;
/** Inspect a supplied nonclinical stimulus timing record; no stimulation settings are recommended. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pulseWidth, period, pulseCount } = request;
  const compute = (): Output => {
    H.positive(period);
    H.domain(pulseWidth >= 0 && pulseWidth <= period);
    H.integer(pulseCount, 0);
    return {
      dutyFraction: pulseWidth / period,
      totalOnTime: pulseWidth * pulseCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pulseWidth: 2, period: 10, pulseCount: 5 },
  output: { dutyFraction: 0.2, totalOnTime: 10 },
} satisfies ToolExample<Input, Output>;
export const stimulusPulseDutyFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/stimulus-pulse-duty-fraction",
    title: "Stimulus Pulse Duty Fraction Tool",
    description:
      "Inspect a supplied nonclinical stimulus timing record; no stimulation settings are recommended.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pulseWidth: { type: "number", minimum: 0 },
        period: { type: "number", exclusiveMinimum: 0 },
        pulseCount: { type: "integer", minimum: 0 },
      },
      required: ["pulseWidth", "period", "pulseCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dutyFraction: { type: "number" },
        totalOnTime: { type: "number" },
      },
      required: ["dutyFraction", "totalOnTime"],
    },
    ports: {
      inputs: [
        {
          id: "pulseWidth",
          label: "Pulse Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pulseCount",
          label: "Pulse Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "dutyFraction",
          label: "Duty Fraction",
          valueType: { type: "number" },
        },
        {
          id: "totalOnTime",
          label: "Total On Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stimulusPulseDutyFractionTool.execute;
export default stimulusPulseDutyFractionTool;
