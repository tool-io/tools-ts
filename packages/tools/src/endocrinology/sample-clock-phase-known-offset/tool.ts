import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clockMinutes: number;
  readonly offsetMinutes: number;
  readonly offsetKnown: boolean;
  readonly periodMinutes: number;
};
export type Output = {
  readonly phaseKnown: boolean;
  readonly referencePhase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clockMinutes: { type: "number" },
    offsetMinutes: { type: "number" },
    offsetKnown: { type: "boolean" },
    periodMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["clockMinutes", "offsetMinutes", "offsetKnown", "periodMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseKnown: { type: "boolean" },
    referencePhase: { type: "number" },
  },
  required: ["phaseKnown", "referencePhase"],
} as const;
/** Reference clock phase for a research sample only when its offset is explicitly known; no biological phase estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clockMinutes, offsetMinutes, offsetKnown, periodMinutes } = request;
  const compute = (): Output => {
    H.positive(periodMinutes);
    const r = (clockMinutes - offsetMinutes) % periodMinutes;
    return {
      phaseKnown: offsetKnown,
      referencePhase: offsetKnown ? (r < 0 ? r + periodMinutes : r) : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    clockMinutes: 600,
    offsetMinutes: 120,
    offsetKnown: true,
    periodMinutes: 1440,
  },
  output: { phaseKnown: true, referencePhase: 480 },
} satisfies ToolExample<Input, Output>;
export const sampleClockPhaseKnownOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/sample-clock-phase-known-offset",
    title: "Sample Clock Phase Known Offset Tool",
    description:
      "Reference clock phase for a research sample only when its offset is explicitly known; no biological phase estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clockMinutes: { type: "number" },
        offsetMinutes: { type: "number" },
        offsetKnown: { type: "boolean" },
        periodMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "clockMinutes",
        "offsetMinutes",
        "offsetKnown",
        "periodMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseKnown: { type: "boolean" },
        referencePhase: { type: "number" },
      },
      required: ["phaseKnown", "referencePhase"],
    },
    ports: {
      inputs: [
        {
          id: "clockMinutes",
          label: "Clock Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetMinutes",
          label: "Offset Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "periodMinutes",
          label: "Period Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseKnown",
          label: "Phase Known",
          valueType: { type: "boolean" },
        },
        {
          id: "referencePhase",
          label: "Reference Phase",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleClockPhaseKnownOffsetTool.execute;
export default sampleClockPhaseKnownOffsetTool;
