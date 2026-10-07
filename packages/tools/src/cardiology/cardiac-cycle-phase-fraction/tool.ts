import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventOffsetMilliseconds: number;
  readonly cycleMilliseconds: number;
};
export type Output = {
  readonly phaseFraction: number;
  readonly withinCycle: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventOffsetMilliseconds: { type: "number" },
    cycleMilliseconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eventOffsetMilliseconds", "cycleMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseFraction: { type: "number" },
    withinCycle: { type: "boolean" },
  },
  required: ["phaseFraction", "withinCycle"],
} as const;
/** Normalize an explicit cardiac event offset to a supplied cycle duration without wrapping or assigning physiological phases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventOffsetMilliseconds, cycleMilliseconds } = request;
  const compute = (): Output => {
    (H.domain(cycleMilliseconds > 0, "cycleMilliseconds"), cycleMilliseconds);
    return {
      phaseFraction: eventOffsetMilliseconds / cycleMilliseconds,
      withinCycle:
        eventOffsetMilliseconds >= 0 &&
        eventOffsetMilliseconds < cycleMilliseconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventOffsetMilliseconds: 200, cycleMilliseconds: 800 },
  output: { phaseFraction: 0.25, withinCycle: true },
} satisfies ToolExample<Input, Output>;
export const cardiacCyclePhaseFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["cardiology", "health and medicine"],
      keywords: ["cardiology", "health and medicine"],
    },
    id: "cardiology/cardiac-cycle-phase-fraction",
    title: "Cardiac Cycle Phase Fraction",
    description:
      "Normalize an explicit cardiac event offset to a supplied cycle duration without wrapping or assigning physiological phases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventOffsetMilliseconds: { type: "number" },
        cycleMilliseconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eventOffsetMilliseconds", "cycleMilliseconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseFraction: { type: "number" },
        withinCycle: { type: "boolean" },
      },
      required: ["phaseFraction", "withinCycle"],
    },
    ports: {
      inputs: [
        {
          id: "eventOffsetMilliseconds",
          label: "Event Offset Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleMilliseconds",
          label: "Cycle Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseFraction",
          label: "Phase Fraction",
          valueType: { type: "number" },
        },
        {
          id: "withinCycle",
          label: "Within Cycle",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cardiacCyclePhaseFractionTool.execute;
export default cardiacCyclePhaseFractionTool;
