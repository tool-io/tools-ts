import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDay: number;
  readonly endDay: number;
  readonly endIncluded: boolean;
};
export type Output = { readonly spanDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDay: { type: "integer" },
    endDay: { type: "integer" },
    endIncluded: { type: "boolean" },
  },
  required: ["startDay", "endDay", "endIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spanDays: { type: "integer" } },
  required: ["spanDays"],
} as const;
/** Measure explicitly supplied public clause day bounds without interpreting obligations or forecasting compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDay, endDay, endIncluded } = request;
  const compute = (): Output => {
    H.domain(startDay <= endDay);
    return { spanDays: endDay - startDay + (endIncluded ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startDay: 100, endDay: 130, endIncluded: false },
  output: { spanDays: 30 },
} satisfies ToolExample<Input, Output>;
export const ceasefireClauseDateSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/ceasefire-clause-date-span",
    title: "Ceasefire Clause Date Span Tool",
    description:
      "Measure explicitly supplied public clause day bounds without interpreting obligations or forecasting compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDay: { type: "integer" },
        endDay: { type: "integer" },
        endIncluded: { type: "boolean" },
      },
      required: ["startDay", "endDay", "endIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spanDays: { type: "integer" } },
      required: ["spanDays"],
    },
    ports: {
      inputs: [
        {
          id: "startDay",
          label: "Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endDay",
          label: "End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endIncluded",
          label: "End Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "spanDays", label: "Span Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = ceasefireClauseDateSpanTool.execute;
export default ceasefireClauseDateSpanTool;
