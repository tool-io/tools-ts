import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evaluationDate: string;
  readonly suppliedExpiryDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evaluationDate: { type: "string", maxLength: 8192 },
    suppliedExpiryDate: { type: "string", maxLength: 8192 },
  },
  required: ["evaluationDate", "suppliedExpiryDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed calendar days to an explicitly supplied delegation expiry date; business-calendar selection remains caller-owned. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evaluationDate, suppliedExpiryDate } = request;
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
        (namedDate(suppliedExpiryDate, "suppliedExpiryDate").getTime() -
          namedDate(evaluationDate, "evaluationDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evaluationDate: "2026-10-28", suppliedExpiryDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const delegationExpiryBusinessDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/delegation-expiry-business-date",
    title: "Delegation Expiry Business Date",
    description:
      "Calculate signed calendar days to an explicitly supplied delegation expiry date; business-calendar selection remains caller-owned.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evaluationDate: { type: "string", maxLength: 8192 },
        suppliedExpiryDate: { type: "string", maxLength: 8192 },
      },
      required: ["evaluationDate", "suppliedExpiryDate"],
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
          id: "evaluationDate",
          label: "Evaluation Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedExpiryDate",
          label: "Supplied Expiry Date",
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
export const run = delegationExpiryBusinessDateTool.execute;
export default delegationExpiryBusinessDateTool;
