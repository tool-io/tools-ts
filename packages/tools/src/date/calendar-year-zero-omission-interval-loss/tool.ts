import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startAstronomical: number;
  readonly endAstronomical: number;
};
export type Output = {
  readonly crossesZero: boolean;
  readonly omittedYearCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startAstronomical: { type: "integer" },
    endAstronomical: { type: "integer" },
  },
  required: ["startAstronomical", "endAstronomical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossesZero: { type: "boolean" },
    omittedYearCount: { type: "integer" },
  },
  required: ["crossesZero", "omittedYearCount"],
} as const;
/** Calculate calendar year zero omission interval loss from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { startAstronomical, endAstronomical } = input;
  const compute = (): Output => {
    H.domain(startAstronomical <= endAstronomical);
    const crossesZero = startAstronomical <= 0 && endAstronomical >= 0;
    return { crossesZero, omittedYearCount: crossesZero ? 1 : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { startAstronomical: -2, endAstronomical: 2 },
  output: { crossesZero: true, omittedYearCount: 1 },
} satisfies ToolExample<Input, Output>;
export const calendarYearZeroOmissionIntervalLossTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "date/calendar-year-zero-omission-interval-loss",
      title: "Calendar Year Zero Omission Interval Loss Tool",
      description:
        "Calculate calendar year zero omission interval loss from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startAstronomical: { type: "integer" },
          endAstronomical: { type: "integer" },
        },
        required: ["startAstronomical", "endAstronomical"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          crossesZero: { type: "boolean" },
          omittedYearCount: { type: "integer" },
        },
        required: ["crossesZero", "omittedYearCount"],
      },
      ports: {
        inputs: [
          {
            id: "startAstronomical",
            label: "Start Astronomical",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "endAstronomical",
            label: "End Astronomical",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "crossesZero",
            label: "Crosses Zero",
            valueType: { type: "boolean" },
          },
          {
            id: "omittedYearCount",
            label: "Omitted Year Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = calendarYearZeroOmissionIntervalLossTool.execute;
export default calendarYearZeroOmissionIntervalLossTool;
