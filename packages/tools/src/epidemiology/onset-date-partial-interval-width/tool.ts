import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestDay: number;
  readonly latestDay: number;
  readonly inclusiveDays: boolean;
};
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestDay: { type: "integer" },
    latestDay: { type: "integer" },
    inclusiveDays: { type: "boolean" },
  },
  required: ["earliestDay", "latestDay", "inclusiveDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "integer" } },
  required: ["width"],
} as const;
/** Width of a supplied partial onset-date interval under an explicit inclusive-day convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestDay, latestDay, inclusiveDays } = request;
  const compute = (): Output => {
    H.domain(latestDay >= earliestDay);
    return { width: latestDay - earliestDay + (inclusiveDays ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestDay: 100, latestDay: 105, inclusiveDays: true },
  output: { width: 6 },
} satisfies ToolExample<Input, Output>;
export const onsetDatePartialIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/onset-date-partial-interval-width",
    title: "Onset Date Partial Interval Width Tool",
    description:
      "Width of a supplied partial onset-date interval under an explicit inclusive-day convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestDay: { type: "integer" },
        latestDay: { type: "integer" },
        inclusiveDays: { type: "boolean" },
      },
      required: ["earliestDay", "latestDay", "inclusiveDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "integer" } },
      required: ["width"],
    },
    ports: {
      inputs: [
        {
          id: "earliestDay",
          label: "Earliest Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "latestDay",
          label: "Latest Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusiveDays",
          label: "Inclusive Days",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = onsetDatePartialIntervalWidthTool.execute;
export default onsetDatePartialIntervalWidthTool;
