import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evidenceDate: string;
  readonly validForDays: number;
  readonly assessmentDate: string;
};
export type Output = {
  readonly ageDays: number;
  readonly remainingDays: number;
  readonly withinSuppliedWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidenceDate: { type: "string", maxLength: 8192 },
    validForDays: { type: "integer", minimum: 0 },
    assessmentDate: { type: "string", maxLength: 8192 },
  },
  required: ["evidenceDate", "validForDays", "assessmentDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    remainingDays: { type: "integer" },
    withinSuppliedWindow: { type: "boolean" },
  },
  required: ["ageDays", "remainingDays", "withinSuppliedWindow"],
} as const;
/** Compare dated prior-learning evidence with an explicit inclusive validity window without selecting an accreditation policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceDate, validForDays, assessmentDate } = request;
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
    (H.domain(
      Number.isSafeInteger(validForDays) &&
        validForDays >= 0 &&
        validForDays <= Number.MAX_SAFE_INTEGER,
      "validForDays",
    ),
      validForDays);
    const ageDays =
      (namedDate(assessmentDate, "assessmentDate").getTime() -
        namedDate(evidenceDate, "evidenceDate").getTime()) /
      86400000;
    H.domain(ageDays >= 0, "assessmentDate");
    return {
      ageDays,
      remainingDays: validForDays - ageDays,
      withinSuppliedWindow: ageDays <= validForDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    evidenceDate: "2026-01-01",
    validForDays: 365,
    assessmentDate: "2026-11-01",
  },
  output: { ageDays: 304, remainingDays: 61, withinSuppliedWindow: true },
} satisfies ToolExample<Input, Output>;
export const priorLearningEvidenceExpiryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/prior-learning-evidence-expiry",
    title: "Prior Learning Evidence Expiry",
    description:
      "Compare dated prior-learning evidence with an explicit inclusive validity window without selecting an accreditation policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceDate: { type: "string", maxLength: 8192 },
        validForDays: { type: "integer", minimum: 0 },
        assessmentDate: { type: "string", maxLength: 8192 },
      },
      required: ["evidenceDate", "validForDays", "assessmentDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        remainingDays: { type: "integer" },
        withinSuppliedWindow: { type: "boolean" },
      },
      required: ["ageDays", "remainingDays", "withinSuppliedWindow"],
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
          id: "validForDays",
          label: "Valid For Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "assessmentDate",
          label: "Assessment Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        {
          id: "withinSuppliedWindow",
          label: "Within Supplied Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = priorLearningEvidenceExpiryTool.execute;
export default priorLearningEvidenceExpiryTool;
