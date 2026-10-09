import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hypothesisDate: string;
  readonly evidenceDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hypothesisDate: { type: "string", maxLength: 8192 },
    evidenceDate: { type: "string", maxLength: 8192 },
  },
  required: ["hypothesisDate", "evidenceDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed calendar days between supplied hypothesis registration and evidence dates without judging evidential strength. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hypothesisDate, evidenceDate } = request;
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
        (namedDate(evidenceDate, "evidenceDate").getTime() -
          namedDate(hypothesisDate, "hypothesisDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hypothesisDate: "2026-10-28", evidenceDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const startupHypothesisEvidenceDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-hypothesis-evidence-date-gap",
    title: "Startup Hypothesis Evidence Date Gap Tool",
    description:
      "Measure signed calendar days between supplied hypothesis registration and evidence dates without judging evidential strength.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hypothesisDate: { type: "string", maxLength: 8192 },
        evidenceDate: { type: "string", maxLength: 8192 },
      },
      required: ["hypothesisDate", "evidenceDate"],
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
          id: "hypothesisDate",
          label: "Hypothesis Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceDate",
          label: "Evidence Date",
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
export const run = startupHypothesisEvidenceDateGapTool.execute;
export default startupHypothesisEvidenceDateGapTool;
