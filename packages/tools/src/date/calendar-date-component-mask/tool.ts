import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yearPresent: boolean;
  readonly monthPresent: boolean;
  readonly dayPresent: boolean;
};
export type Output = { readonly mask: number; readonly hierarchical: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yearPresent: { type: "boolean" },
    monthPresent: { type: "boolean" },
    dayPresent: { type: "boolean" },
  },
  required: ["yearPresent", "monthPresent", "dayPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mask: { type: "integer" }, hierarchical: { type: "boolean" } },
  required: ["mask", "hierarchical"],
} as const;
/** Encode supplied year/month/day presence as bits 4/2/1; not a date-value validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yearPresent, monthPresent, dayPresent } = request;
  const compute = (): Output => {
    return {
      mask:
        (yearPresent ? 4 : 0) + (monthPresent ? 2 : 0) + (dayPresent ? 1 : 0),
      hierarchical:
        (!dayPresent || (monthPresent && yearPresent)) &&
        (!monthPresent || yearPresent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yearPresent: true, monthPresent: true, dayPresent: false },
  output: { mask: 6, hierarchical: true },
} satisfies ToolExample<Input, Output>;
export const calendarDateComponentMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/calendar-date-component-mask",
    title: "Calendar Date Component Mask Tool",
    description:
      "Encode supplied year/month/day presence as bits 4/2/1; not a date-value validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearPresent: { type: "boolean" },
        monthPresent: { type: "boolean" },
        dayPresent: { type: "boolean" },
      },
      required: ["yearPresent", "monthPresent", "dayPresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mask: { type: "integer" },
        hierarchical: { type: "boolean" },
      },
      required: ["mask", "hierarchical"],
    },
    ports: {
      inputs: [
        {
          id: "yearPresent",
          label: "Year Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "monthPresent",
          label: "Month Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "dayPresent",
          label: "Day Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "mask", label: "Mask", valueType: { type: "integer" } },
        {
          id: "hierarchical",
          label: "Hierarchical",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = calendarDateComponentMaskTool.execute;
export default calendarDateComponentMaskTool;
