import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yearKnown: boolean;
  readonly monthKnown: boolean;
  readonly dayKnown: boolean;
};
export type Output = {
  readonly precision: string;
  readonly consistent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yearKnown: { type: "boolean" },
    monthKnown: { type: "boolean" },
    dayKnown: { type: "boolean" },
  },
  required: ["yearKnown", "monthKnown", "dayKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    precision: { type: "string", maxLength: 8192 },
    consistent: { type: "boolean" },
  },
  required: ["precision", "consistent"],
} as const;
/** Inspect supplied date-field presence flags without inferring a missing date or edition identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yearKnown, monthKnown, dayKnown } = request;
  const compute = (): Output => {
    return {
      precision: dayKnown
        ? "day"
        : monthKnown
          ? "month"
          : yearKnown
            ? "year"
            : "unknown",
      consistent:
        (!dayKnown || (monthKnown && yearKnown)) && (!monthKnown || yearKnown),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yearKnown: true, monthKnown: true, dayKnown: false },
  output: { precision: "month", consistent: true },
} satisfies ToolExample<Input, Output>;
export const editionDatePrecisionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/edition-date-precision-code",
    title: "Edition Date Precision Code Tool",
    description:
      "Inspect supplied date-field presence flags without inferring a missing date or edition identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearKnown: { type: "boolean" },
        monthKnown: { type: "boolean" },
        dayKnown: { type: "boolean" },
      },
      required: ["yearKnown", "monthKnown", "dayKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        precision: { type: "string", maxLength: 8192 },
        consistent: { type: "boolean" },
      },
      required: ["precision", "consistent"],
    },
    ports: {
      inputs: [
        {
          id: "yearKnown",
          label: "Year Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "monthKnown",
          label: "Month Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "dayKnown",
          label: "Day Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "precision", label: "Precision", valueType: { type: "string" } },
        {
          id: "consistent",
          label: "Consistent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = editionDatePrecisionCodeTool.execute;
export default editionDatePrecisionCodeTool;
