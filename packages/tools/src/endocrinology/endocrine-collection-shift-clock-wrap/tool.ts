import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minuteOfDay: number;
  readonly suppliedShiftMinutes: number;
};
export type Output = {
  readonly shiftedMinuteOfDay: number;
  readonly dayOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "number", minimum: 0, exclusiveMaximum: 1440 },
    suppliedShiftMinutes: { type: "number" },
  },
  required: ["minuteOfDay", "suppliedShiftMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedMinuteOfDay: { type: "number" },
    dayOffset: { type: "integer" },
  },
  required: ["shiftedMinuteOfDay", "dayOffset"],
} as const;
/** Shift an explicit collection clock minute by supplied elapsed minutes, reporting wrapped clock and signed day offset without time-zone inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minuteOfDay, suppliedShiftMinutes } = request;
  const compute = (): Output => {
    H.domain(minuteOfDay >= 0 && minuteOfDay < 1440, "minuteOfDay");
    return (() => {
      const shifted = minuteOfDay + suppliedShiftMinutes;
      H.domain(Number.isFinite(shifted), "suppliedShiftMinutes");
      const remainder = shifted % 1440;
      return {
        shiftedMinuteOfDay: remainder < 0 ? remainder + 1440 : remainder,
        dayOffset: Math.floor(shifted / 1440),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minuteOfDay: 1430, suppliedShiftMinutes: 30 },
  output: { shiftedMinuteOfDay: 20, dayOffset: 1 },
} satisfies ToolExample<Input, Output>;
export const endocrineCollectionShiftClockWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/endocrine-collection-shift-clock-wrap",
    title: "Endocrine Collection Shift Clock Wrap Tool",
    description:
      "Shift an explicit collection clock minute by supplied elapsed minutes, reporting wrapped clock and signed day offset without time-zone inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "number", minimum: 0, exclusiveMaximum: 1440 },
        suppliedShiftMinutes: { type: "number" },
      },
      required: ["minuteOfDay", "suppliedShiftMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedMinuteOfDay: { type: "number" },
        dayOffset: { type: "integer" },
      },
      required: ["shiftedMinuteOfDay", "dayOffset"],
    },
    ports: {
      inputs: [
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedShiftMinutes",
          label: "Supplied Shift Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shiftedMinuteOfDay",
          label: "Shifted Minute Of Day",
          valueType: { type: "number" },
        },
        {
          id: "dayOffset",
          label: "Day Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = endocrineCollectionShiftClockWrapTool.execute;
export default endocrineCollectionShiftClockWrapTool;
