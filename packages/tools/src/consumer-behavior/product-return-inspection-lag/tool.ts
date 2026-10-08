import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnReceivedDate: string;
  readonly inspectionDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnReceivedDate: { type: "string", maxLength: 8192 },
    inspectionDate: { type: "string", maxLength: 8192 },
  },
  required: ["returnReceivedDate", "inspectionDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed calendar-day lag between supplied product return receipt and inspection dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnReceivedDate, inspectionDate } = request;
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
    return {
      signedCalendarDays:
        (namedDate(inspectionDate, "inspectionDate").getTime() -
          namedDate(returnReceivedDate, "returnReceivedDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returnReceivedDate: "2026-10-28", inspectionDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const productReturnInspectionLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/product-return-inspection-lag",
    title: "Product Return Inspection Lag",
    description:
      "Calculate signed calendar-day lag between supplied product return receipt and inspection dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnReceivedDate: { type: "string", maxLength: 8192 },
        inspectionDate: { type: "string", maxLength: 8192 },
      },
      required: ["returnReceivedDate", "inspectionDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "integer" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "returnReceivedDate",
          label: "Return Received Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inspectionDate",
          label: "Inspection Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = productReturnInspectionLagTool.execute;
export default productReturnInspectionLagTool;
