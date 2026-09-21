import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDay: number;
  readonly lastDay: number;
  readonly inclusive: boolean;
};
export type Output = { readonly spanDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDay: { type: "integer" },
    lastDay: { type: "integer" },
    inclusive: { type: "boolean" },
  },
  required: ["firstDay", "lastDay", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spanDays: { type: "integer" } },
  required: ["spanDays"],
} as const;
/** Measure supplied public land-record date bounds without determining title or historical land units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDay, lastDay, inclusive } = request;
  const compute = (): Output => {
    H.domain(firstDay <= lastDay);
    return { spanDays: lastDay - firstDay + (inclusive ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDay: 100, lastDay: 130, inclusive: true },
  output: { spanDays: 31 },
} satisfies ToolExample<Input, Output>;
export const publicLandRecordDateSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/public-land-record-date-span",
    title: "Public Land Record Date Span Tool",
    description:
      "Measure supplied public land-record date bounds without determining title or historical land units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDay: { type: "integer" },
        lastDay: { type: "integer" },
        inclusive: { type: "boolean" },
      },
      required: ["firstDay", "lastDay", "inclusive"],
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
          id: "firstDay",
          label: "First Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastDay",
          label: "Last Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
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
export const run = publicLandRecordDateSpanTool.execute;
export default publicLandRecordDateSpanTool;
