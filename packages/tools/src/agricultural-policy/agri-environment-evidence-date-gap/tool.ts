import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evidenceDate: string;
  readonly assessmentDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidenceDate: { type: "string", maxLength: 8192 },
    assessmentDate: { type: "string", maxLength: 8192 },
  },
  required: ["evidenceDate", "assessmentDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days from explicit agri-environment evidence to assessment date without determining admissibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceDate, assessmentDate } = request;
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
        (namedDate(assessmentDate, "assessmentDate").getTime() -
          namedDate(evidenceDate, "evidenceDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evidenceDate: "2026-10-28", assessmentDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const agriEnvironmentEvidenceDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/agri-environment-evidence-date-gap",
    title: "Agri Environment Evidence Date Gap",
    description:
      "Count signed calendar days from explicit agri-environment evidence to assessment date without determining admissibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceDate: { type: "string", maxLength: 8192 },
        assessmentDate: { type: "string", maxLength: 8192 },
      },
      required: ["evidenceDate", "assessmentDate"],
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
          id: "evidenceDate",
          label: "Evidence Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assessmentDate",
          label: "Assessment Date",
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
export const run = agriEnvironmentEvidenceDateGapTool.execute;
export default agriEnvironmentEvidenceDateGapTool;
