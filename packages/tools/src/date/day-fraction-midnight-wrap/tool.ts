import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dayFraction: number;
  readonly addedFraction: number;
};
export type Output = {
  readonly dayCarry: number;
  readonly withinDayFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayFraction: { type: "number" },
    addedFraction: { type: "number" },
  },
  required: ["dayFraction", "addedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayCarry: { type: "integer" },
    withinDayFraction: { type: "number" },
  },
  required: ["dayCarry", "withinDayFraction"],
} as const;
/** Wrap explicitly supplied elapsed-day fractions at integer midnight boundaries, without time zones or leap seconds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dayFraction, addedFraction } = request;
  const compute = (): Output => {
    const total = H.finite(dayFraction + addedFraction),
      dayCarry = Math.floor(total);
    return { dayCarry, withinDayFraction: total - dayCarry };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dayFraction: 0.75, addedFraction: 0.5 },
  output: { dayCarry: 1, withinDayFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const dayFractionMidnightWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/day-fraction-midnight-wrap",
    title: "Day Fraction Midnight Wrap Tool",
    description:
      "Wrap explicitly supplied elapsed-day fractions at integer midnight boundaries, without time zones or leap seconds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayFraction: { type: "number" },
        addedFraction: { type: "number" },
      },
      required: ["dayFraction", "addedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayCarry: { type: "integer" },
        withinDayFraction: { type: "number" },
      },
      required: ["dayCarry", "withinDayFraction"],
    },
    ports: {
      inputs: [
        {
          id: "dayFraction",
          label: "Day Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedFraction",
          label: "Added Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dayCarry", label: "Day Carry", valueType: { type: "integer" } },
        {
          id: "withinDayFraction",
          label: "Within Day Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dayFractionMidnightWrapTool.execute;
export default dayFractionMidnightWrapTool;
