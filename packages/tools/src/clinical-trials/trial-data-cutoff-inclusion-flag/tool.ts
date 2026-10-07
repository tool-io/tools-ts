import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordDate: string;
  readonly cutoffDate: string;
  readonly includeCutoffDate: boolean;
};
export type Output = { readonly includedByDatePolicy: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordDate: { type: "string", maxLength: 8192 },
    cutoffDate: { type: "string", maxLength: 8192 },
    includeCutoffDate: { type: "boolean" },
  },
  required: ["recordDate", "cutoffDate", "includeCutoffDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includedByDatePolicy: { type: "boolean" } },
  required: ["includedByDatePolicy"],
} as const;
/** Apply an explicit calendar-date data cutoff with a supplied equality policy without deciding analysis populations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordDate, cutoffDate, includeCutoffDate } = request;
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
      includedByDatePolicy: includeCutoffDate
        ? namedDate(recordDate, "recordDate") <=
          namedDate(cutoffDate, "cutoffDate")
        : namedDate(recordDate, "recordDate") <
          namedDate(cutoffDate, "cutoffDate"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordDate: "2026-10-31",
    cutoffDate: "2026-11-01",
    includeCutoffDate: false,
  },
  output: { includedByDatePolicy: true },
} satisfies ToolExample<Input, Output>;
export const trialDataCutoffInclusionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-trials",
        "clinical trials",
        "research and quality management",
      ],
      keywords: ["clinical trials", "research and quality management"],
    },
    id: "clinical-trials/trial-data-cutoff-inclusion-flag",
    title: "Trial Data Cutoff Inclusion Flag",
    description:
      "Apply an explicit calendar-date data cutoff with a supplied equality policy without deciding analysis populations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordDate: { type: "string", maxLength: 8192 },
        cutoffDate: { type: "string", maxLength: 8192 },
        includeCutoffDate: { type: "boolean" },
      },
      required: ["recordDate", "cutoffDate", "includeCutoffDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { includedByDatePolicy: { type: "boolean" } },
      required: ["includedByDatePolicy"],
    },
    ports: {
      inputs: [
        {
          id: "recordDate",
          label: "Record Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cutoffDate",
          label: "Cutoff Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "includeCutoffDate",
          label: "Include Cutoff Date",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "includedByDatePolicy",
          label: "Included By Date Policy",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialDataCutoffInclusionFlagTool.execute;
export default trialDataCutoffInclusionFlagTool;
