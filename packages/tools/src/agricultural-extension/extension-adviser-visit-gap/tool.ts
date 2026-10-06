import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousVisitDate: string;
  readonly currentVisitDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousVisitDate: { type: "string", maxLength: 8192 },
    currentVisitDate: { type: "string", maxLength: 8192 },
  },
  required: ["previousVisitDate", "currentVisitDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days between recorded adviser visits without selecting service intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousVisitDate, currentVisitDate } = request;
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
        (namedDate(currentVisitDate, "currentVisitDate").getTime() -
          namedDate(previousVisitDate, "previousVisitDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousVisitDate: "2026-10-28", currentVisitDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const extensionAdviserVisitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/extension-adviser-visit-gap",
    title: "Extension Adviser Visit Gap",
    description:
      "Count signed calendar days between recorded adviser visits without selecting service intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousVisitDate: { type: "string", maxLength: 8192 },
        currentVisitDate: { type: "string", maxLength: 8192 },
      },
      required: ["previousVisitDate", "currentVisitDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "number" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "previousVisitDate",
          label: "Previous Visit Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentVisitDate",
          label: "Current Visit Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = extensionAdviserVisitGapTool.execute;
export default extensionAdviserVisitGapTool;
