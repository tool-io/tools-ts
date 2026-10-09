import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly withdrawalDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly withdrawalEffective: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withdrawalDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["withdrawalDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withdrawalEffective: { type: "boolean" } },
  required: ["withdrawalEffective"],
} as const;
/** Compare explicit date-only withdrawal and evaluation dates under an inclusive effective-date convention without determining consent scope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { withdrawalDate, asOfDate } = request;
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
      withdrawalEffective:
        namedDate(asOfDate, "asOfDate").getTime() >=
        namedDate(withdrawalDate, "withdrawalDate").getTime(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { withdrawalDate: "2026-10-28", asOfDate: "2026-11-01" },
  output: { withdrawalEffective: true },
} satisfies ToolExample<Input, Output>;
export const recordingConsentWithdrawalAsOfDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/recording-consent-withdrawal-as-of-date",
    title: "Recording Consent Withdrawal As Of Date Tool",
    description:
      "Compare explicit date-only withdrawal and evaluation dates under an inclusive effective-date convention without determining consent scope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withdrawalDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["withdrawalDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withdrawalEffective: { type: "boolean" } },
      required: ["withdrawalEffective"],
    },
    ports: {
      inputs: [
        {
          id: "withdrawalDate",
          label: "Withdrawal Date",
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
          id: "withdrawalEffective",
          label: "Withdrawal Effective",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = recordingConsentWithdrawalAsOfDateTool.execute;
export default recordingConsentWithdrawalAsOfDateTool;
