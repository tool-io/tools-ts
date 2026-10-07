import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly onlineDate: string; readonly printDate: string };
export type Output = { readonly printMinusOnlineDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onlineDate: { type: "string", maxLength: 8192 },
    printDate: { type: "string", maxLength: 8192 },
  },
  required: ["onlineDate", "printDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { printMinusOnlineDays: { type: "integer" } },
  required: ["printMinusOnlineDays"],
} as const;
/** Compare explicit online and print publication dates in signed Gregorian calendar days without choosing an official publication date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onlineDate, printDate } = request;
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
      printMinusOnlineDays:
        (namedDate(printDate, "printDate").getTime() -
          namedDate(onlineDate, "onlineDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onlineDate: "2026-10-01", printDate: "2026-11-01" },
  output: { printMinusOnlineDays: 31 },
} satisfies ToolExample<Input, Output>;
export const publicationOnlinePrintDateDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/publication-online-print-date-delta",
    title: "Publication Online Print Date Delta",
    description:
      "Compare explicit online and print publication dates in signed Gregorian calendar days without choosing an official publication date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onlineDate: { type: "string", maxLength: 8192 },
        printDate: { type: "string", maxLength: 8192 },
      },
      required: ["onlineDate", "printDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { printMinusOnlineDays: { type: "integer" } },
      required: ["printMinusOnlineDays"],
    },
    ports: {
      inputs: [
        {
          id: "onlineDate",
          label: "Online Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "printDate",
          label: "Print Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "printMinusOnlineDays",
          label: "Print Minus Online Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicationOnlinePrintDateDeltaTool.execute;
export default publicationOnlinePrintDateDeltaTool;
