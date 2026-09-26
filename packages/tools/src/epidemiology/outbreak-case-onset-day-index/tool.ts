import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onsetDay: number;
  readonly originDay: number;
  readonly dayOne: boolean;
};
export type Output = { readonly dayIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetDay: { type: "integer" },
    originDay: { type: "integer" },
    dayOne: { type: "boolean" },
  },
  required: ["onsetDay", "originDay", "dayOne"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dayIndex: { type: "integer" } },
  required: ["dayIndex"],
} as const;
/** Signed outbreak day index on a caller-defined absolute-day axis; one-based numbering is optional. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onsetDay, originDay, dayOne } = request;
  const compute = (): Output => {
    return { dayIndex: onsetDay - originDay + (dayOne ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onsetDay: 110, originDay: 100, dayOne: true },
  output: { dayIndex: 11 },
} satisfies ToolExample<Input, Output>;
export const outbreakCaseOnsetDayIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/outbreak-case-onset-day-index",
    title: "Outbreak Case Onset Day Index Tool",
    description:
      "Signed outbreak day index on a caller-defined absolute-day axis; one-based numbering is optional.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onsetDay: { type: "integer" },
        originDay: { type: "integer" },
        dayOne: { type: "boolean" },
      },
      required: ["onsetDay", "originDay", "dayOne"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dayIndex: { type: "integer" } },
      required: ["dayIndex"],
    },
    ports: {
      inputs: [
        {
          id: "onsetDay",
          label: "Onset Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originDay",
          label: "Origin Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dayOne",
          label: "Day One",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "dayIndex", label: "Day Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = outbreakCaseOnsetDayIndexTool.execute;
export default outbreakCaseOnsetDayIndexTool;
