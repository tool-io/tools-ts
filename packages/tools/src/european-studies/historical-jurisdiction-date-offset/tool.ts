import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordDay: number;
  readonly sourceCalendarOffset: number;
  readonly referenceDay: number;
};
export type Output = {
  readonly normalizedDay: number;
  readonly offsetDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordDay: { type: "integer" },
    sourceCalendarOffset: { type: "integer" },
    referenceDay: { type: "integer" },
  },
  required: ["recordDay", "sourceCalendarOffset", "referenceDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedDay: { type: "integer" },
    offsetDays: { type: "integer" },
  },
  required: ["normalizedDay", "offsetDays"],
} as const;
/** Apply an independently supplied historical calendar offset without inferring jurisdictional calendar adoption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordDay, sourceCalendarOffset, referenceDay } = request;
  const compute = (): Output => {
    return {
      normalizedDay: recordDay + sourceCalendarOffset,
      offsetDays: recordDay + sourceCalendarOffset - referenceDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordDay: 100, sourceCalendarOffset: 10, referenceDay: 105 },
  output: { normalizedDay: 110, offsetDays: 5 },
} satisfies ToolExample<Input, Output>;
export const historicalJurisdictionDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/historical-jurisdiction-date-offset",
    title: "Historical Jurisdiction Date Offset Tool",
    description:
      "Apply an independently supplied historical calendar offset without inferring jurisdictional calendar adoption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordDay: { type: "integer" },
        sourceCalendarOffset: { type: "integer" },
        referenceDay: { type: "integer" },
      },
      required: ["recordDay", "sourceCalendarOffset", "referenceDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedDay: { type: "integer" },
        offsetDays: { type: "integer" },
      },
      required: ["normalizedDay", "offsetDays"],
    },
    ports: {
      inputs: [
        {
          id: "recordDay",
          label: "Record Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceCalendarOffset",
          label: "Source Calendar Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceDay",
          label: "Reference Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "normalizedDay",
          label: "Normalized Day",
          valueType: { type: "integer" },
        },
        {
          id: "offsetDays",
          label: "Offset Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalJurisdictionDateOffsetTool.execute;
export default historicalJurisdictionDateOffsetTool;
