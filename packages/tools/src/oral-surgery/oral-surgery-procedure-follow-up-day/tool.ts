import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureDate: string;
  readonly followupDate: string;
};
export type Output = { readonly signedDaysAfterProcedure: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureDate: { type: "string", maxLength: 8192 },
    followupDate: { type: "string", maxLength: 8192 },
  },
  required: ["procedureDate", "followupDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDaysAfterProcedure: { type: "number" } },
  required: ["signedDaysAfterProcedure"],
} as const;
/** Count signed calendar days between explicit oral-surgery procedure and follow-up dates without setting a review schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureDate, followupDate } = request;
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
      signedDaysAfterProcedure:
        (namedDate(followupDate, "followupDate").getTime() -
          namedDate(procedureDate, "procedureDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { procedureDate: "2026-10-01", followupDate: "2026-10-08" },
  output: { signedDaysAfterProcedure: 7 },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryProcedureFollowupDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/oral-surgery-procedure-follow-up-day",
    title: "Oral Surgery Procedure Follow Up Day",
    description:
      "Count signed calendar days between explicit oral-surgery procedure and follow-up dates without setting a review schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureDate: { type: "string", maxLength: 8192 },
        followupDate: { type: "string", maxLength: 8192 },
      },
      required: ["procedureDate", "followupDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDaysAfterProcedure: { type: "number" } },
      required: ["signedDaysAfterProcedure"],
    },
    ports: {
      inputs: [
        {
          id: "procedureDate",
          label: "Procedure Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "followupDate",
          label: "Followup Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedDaysAfterProcedure",
          label: "Signed Days After Procedure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralSurgeryProcedureFollowupDayTool.execute;
export default oralSurgeryProcedureFollowupDayTool;
