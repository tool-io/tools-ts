import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observanceDay: number;
  readonly referenceDay: number;
  readonly suppliedCalendarShift: number;
};
export type Output = { readonly offsetDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observanceDay: { type: "integer" },
    referenceDay: { type: "integer" },
    suppliedCalendarShift: { type: "integer" },
  },
  required: ["observanceDay", "referenceDay", "suppliedCalendarShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetDays: { type: "integer" } },
  required: ["offsetDays"],
} as const;
/** Compare supplied absolute-day indices after an explicit calendar shift, without assigning an observance date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observanceDay, referenceDay, suppliedCalendarShift } = request;
  const compute = (): Output => {
    return { offsetDays: observanceDay + suppliedCalendarShift - referenceDay };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observanceDay: 120, referenceDay: 100, suppliedCalendarShift: -1 },
  output: { offsetDays: 19 },
} satisfies ToolExample<Input, Output>;
export const publicCalendarObservanceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/public-calendar-observance-offset",
    title: "Public Calendar Observance Offset Tool",
    description:
      "Compare supplied absolute-day indices after an explicit calendar shift, without assigning an observance date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observanceDay: { type: "integer" },
        referenceDay: { type: "integer" },
        suppliedCalendarShift: { type: "integer" },
      },
      required: ["observanceDay", "referenceDay", "suppliedCalendarShift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetDays: { type: "integer" } },
      required: ["offsetDays"],
    },
    ports: {
      inputs: [
        {
          id: "observanceDay",
          label: "Observance Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceDay",
          label: "Reference Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedCalendarShift",
          label: "Supplied Calendar Shift",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
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
export const run = publicCalendarObservanceOffsetTool.execute;
export default publicCalendarObservanceOffsetTool;
