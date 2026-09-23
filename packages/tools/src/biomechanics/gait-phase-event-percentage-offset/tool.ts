import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleStart: number;
  readonly cycleEnd: number;
  readonly eventTime: number;
  readonly referencePercent: number;
};
export type Output = {
  readonly percent: number;
  readonly offsetPercentagePoints: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleStart: { type: "number" },
    cycleEnd: { type: "number" },
    eventTime: { type: "number" },
    referencePercent: { type: "number" },
  },
  required: ["cycleStart", "cycleEnd", "eventTime", "referencePercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    percent: { type: "number" },
    offsetPercentagePoints: { type: "number" },
  },
  required: ["percent", "offsetPercentagePoints"],
} as const;
/** Event position in one supplied gait cycle; no gait-phase norm or diagnosis is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleStart, cycleEnd, eventTime, referencePercent } = request;
  const compute = (): Output => {
    H.domain(
      cycleEnd > cycleStart && eventTime >= cycleStart && eventTime <= cycleEnd,
    );
    return {
      percent: (100 * (eventTime - cycleStart)) / (cycleEnd - cycleStart),
      offsetPercentagePoints:
        (100 * (eventTime - cycleStart)) / (cycleEnd - cycleStart) -
        referencePercent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cycleStart: 10,
    cycleEnd: 12,
    eventTime: 10.5,
    referencePercent: 20,
  },
  output: { percent: 25, offsetPercentagePoints: 5 },
} satisfies ToolExample<Input, Output>;
export const gaitPhaseEventPercentageOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/gait-phase-event-percentage-offset",
    title: "Gait Phase Event Percentage Offset Tool",
    description:
      "Event position in one supplied gait cycle; no gait-phase norm or diagnosis is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleStart: { type: "number" },
        cycleEnd: { type: "number" },
        eventTime: { type: "number" },
        referencePercent: { type: "number" },
      },
      required: ["cycleStart", "cycleEnd", "eventTime", "referencePercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        percent: { type: "number" },
        offsetPercentagePoints: { type: "number" },
      },
      required: ["percent", "offsetPercentagePoints"],
    },
    ports: {
      inputs: [
        {
          id: "cycleStart",
          label: "Cycle Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleEnd",
          label: "Cycle End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePercent",
          label: "Reference Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "percent", label: "Percent", valueType: { type: "number" } },
        {
          id: "offsetPercentagePoints",
          label: "Offset Percentage Points",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaitPhaseEventPercentageOffsetTool.execute;
export default gaitPhaseEventPercentageOffsetTool;
