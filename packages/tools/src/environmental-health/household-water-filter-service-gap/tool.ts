import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastServiceDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly signedDaysSinceService: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastServiceDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["lastServiceDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDaysSinceService: { type: "number" } },
  required: ["signedDaysSinceService"],
} as const;
/** Count signed calendar days since an explicitly recorded filter service without selecting a replacement interval or assessing water safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastServiceDate, asOfDate } = request;
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
      signedDaysSinceService:
        (namedDate(asOfDate, "asOfDate").getTime() -
          namedDate(lastServiceDate, "lastServiceDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lastServiceDate: "2026-10-01", asOfDate: "2026-11-01" },
  output: { signedDaysSinceService: 31 },
} satisfies ToolExample<Input, Output>;
export const householdWaterFilterServiceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/household-water-filter-service-gap",
    title: "Household Water Filter Service Gap",
    description:
      "Count signed calendar days since an explicitly recorded filter service without selecting a replacement interval or assessing water safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastServiceDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["lastServiceDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDaysSinceService: { type: "number" } },
      required: ["signedDaysSinceService"],
    },
    ports: {
      inputs: [
        {
          id: "lastServiceDate",
          label: "Last Service Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedDaysSinceService",
          label: "Signed Days Since Service",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdWaterFilterServiceGapTool.execute;
export default householdWaterFilterServiceGapTool;
