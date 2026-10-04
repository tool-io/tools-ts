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
      enum: ["day", "month", "year", "circa", "unknown"],
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
/** Attach an explicit precision annotation to a literal public-history date without inventing missing calendar fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, precision } = request;
  const compute = (): Output => {
    H.domain(dateText.length > 0, "dateText");
    H.domain(
      ["day", "month", "year", "circa", "unknown"].includes(precision),
      "precision",
    );
    return { label: dateText + " [precision=" + precision + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dateText: "c. 1900", precision: "circa" },
  output: { label: "c. 1900 [precision=circa]" },
} satisfies ToolExample<Input, Output>;
export const africanPublicHistoryDatePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-public-history-date-precision",
    title: "African Public History Date Precision Tool",
    description:
      "Attach an explicit precision annotation to a literal public-history date without inventing missing calendar fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192 },
        precision: {
          type: "string",
          maxLength: 8192,
          enum: ["day", "month", "year", "circa", "unknown"],
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
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = africanPublicHistoryDatePrecisionTool.execute;
export default africanPublicHistoryDatePrecisionTool;
