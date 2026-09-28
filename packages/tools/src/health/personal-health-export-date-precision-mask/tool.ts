import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly date: string; readonly precision: string };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string", maxLength: 8192 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["year", "month", "day"],
    },
  },
  required: ["date", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate personal health export date precision mask from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { date, precision } = request;
  const compute = (): Output => {
    const d = H.dateOnly(date);
    H.domain(["year", "month", "day"].includes(precision));
    H.finite(d.getTime());
    return {
      text:
        precision === "year"
          ? date.slice(0, 4)
          : precision === "month"
            ? date.slice(0, 7)
            : date,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { date: "2026-10-26", precision: "month" },
  output: { text: "2026-10" },
} satisfies ToolExample<Input, Output>;
export const personalHealthExportDatePrecisionMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/personal-health-export-date-precision-mask",
      title: "Personal Health Export Date Precision Mask Tool",
      description:
        "Calculate personal health export date precision mask from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          date: { type: "string", maxLength: 8192 },
          precision: {
            type: "string",
            maxLength: 8192,
            enum: ["year", "month", "day"],
          },
        },
        required: ["date", "precision"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string", maxLength: 8192 } },
        required: ["text"],
      },
      ports: {
        inputs: [
          {
            id: "date",
            label: "Date",
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
        outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = personalHealthExportDatePrecisionMaskTool.execute;
export default personalHealthExportDatePrecisionMaskTool;
