import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dateText: string; readonly precision: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["year", "month", "day", "approximate", "unknown"],
    },
  },
  required: ["dateText", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label one ethnographic date with its explicit precision. Exact day, month and year spellings are checked; approximate and unknown text is preserved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, precision } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(
      ["year", "month", "day", "approximate", "unknown"].includes(precision),
      "precision",
    );
    H.domain(dateText.length > 0, "dateText");
    if (precision === "year")
      H.domain(/^\d{4}(?![\s\S])/.test(dateText), "dateText");
    if (precision === "month")
      H.domain(/^\d{4}-(?:0[1-9]|1[0-2])(?![\s\S])/.test(dateText), "dateText");
    if (precision === "day") namedDate(dateText, "dateText");
    return { label: dateText + " [" + precision + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dateText: "2026-10", precision: "month" },
  output: { label: "2026-10 [month]" },
} satisfies ToolExample<Input, Output>;
export const ethnographicDatePrecisionSingleLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anthropology/ethnographic-date-precision-single-label",
      title: "Ethnographic Date Precision Single Label Tool",
      description:
        "Label one ethnographic date with its explicit precision. Exact day, month and year spellings are checked; approximate and unknown text is preserved.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dateText: { type: "string", maxLength: 8192 },
          precision: {
            type: "string",
            maxLength: 8192,
            enum: ["year", "month", "day", "approximate", "unknown"],
          },
        },
        required: ["dateText", "precision"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "dateText",
            label: "Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "precision",
            label: "Precision",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = ethnographicDatePrecisionSingleLabelTool.execute;
export default ethnographicDatePrecisionSingleLabelTool;
