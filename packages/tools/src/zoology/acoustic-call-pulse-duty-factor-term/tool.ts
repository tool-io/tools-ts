import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pulseCount: number;
  readonly pulseDuration: number;
  readonly boutDuration: number;
  readonly overlapDuration: number;
};
export type Output = {
  readonly grossPulseTime: number;
  readonly unionPulseTime: number;
  readonly dutyFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pulseCount: { type: "integer", minimum: 0 },
    pulseDuration: { type: "number", minimum: 0 },
    boutDuration: { type: "number", exclusiveMinimum: 0 },
    overlapDuration: { type: "number", minimum: 0 },
  },
  required: ["pulseCount", "pulseDuration", "boutDuration", "overlapDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPulseTime: { type: "number" },
    unionPulseTime: { type: "number" },
    dutyFactor: { type: "number" },
  },
  required: ["grossPulseTime", "unionPulseTime", "dutyFactor"],
} as const;
/** Pulse-union occupancy using an explicit aggregate overlap correction; no acoustic event detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pulseCount, pulseDuration, boutDuration, overlapDuration } = request;
  const compute = (): Output => {
    H.integer(pulseCount, 0);
    H.domain(
      pulseDuration >= 0 &&
        overlapDuration >= 0 &&
        overlapDuration <= pulseCount * pulseDuration &&
        pulseCount * pulseDuration - overlapDuration <= boutDuration,
    );
    H.positive(boutDuration);
    return {
      grossPulseTime: pulseCount * pulseDuration,
      unionPulseTime: pulseCount * pulseDuration - overlapDuration,
      dutyFactor: (pulseCount * pulseDuration - overlapDuration) / boutDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pulseCount: 10,
    pulseDuration: 0.05,
    boutDuration: 2,
    overlapDuration: 0.1,
  },
  output: { grossPulseTime: 0.5, unionPulseTime: 0.4, dutyFactor: 0.2 },
} satisfies ToolExample<Input, Output>;
export const acousticCallPulseDutyFactorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/acoustic-call-pulse-duty-factor-term",
    title: "Acoustic Call Pulse Duty Factor Term Tool",
    description:
      "Pulse-union occupancy using an explicit aggregate overlap correction; no acoustic event detection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pulseCount: { type: "integer", minimum: 0 },
        pulseDuration: { type: "number", minimum: 0 },
        boutDuration: { type: "number", exclusiveMinimum: 0 },
        overlapDuration: { type: "number", minimum: 0 },
      },
      required: [
        "pulseCount",
        "pulseDuration",
        "boutDuration",
        "overlapDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossPulseTime: { type: "number" },
        unionPulseTime: { type: "number" },
        dutyFactor: { type: "number" },
      },
      required: ["grossPulseTime", "unionPulseTime", "dutyFactor"],
    },
    ports: {
      inputs: [
        {
          id: "pulseCount",
          label: "Pulse Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pulseDuration",
          label: "Pulse Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boutDuration",
          label: "Bout Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossPulseTime",
          label: "Gross Pulse Time",
          valueType: { type: "number" },
        },
        {
          id: "unionPulseTime",
          label: "Union Pulse Time",
          valueType: { type: "number" },
        },
        {
          id: "dutyFactor",
          label: "Duty Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = acousticCallPulseDutyFactorTermTool.execute;
export default acousticCallPulseDutyFactorTermTool;
