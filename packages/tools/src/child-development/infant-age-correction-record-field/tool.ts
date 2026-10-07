import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chronologicalAgeDays: number;
  readonly correctionDays: number;
};
export type Output = {
  readonly correctedAgeDays: number;
  readonly correctionApplied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chronologicalAgeDays: { type: "integer", minimum: 0 },
    correctionDays: { type: "integer", minimum: 0 },
  },
  required: ["chronologicalAgeDays", "correctionDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAgeDays: { type: "integer" },
    correctionApplied: { type: "boolean" },
  },
  required: ["correctedAgeDays", "correctionApplied"],
} as const;
/** Subtract an explicitly supplied age correction from recorded chronological days without determining whether correction is clinically appropriate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chronologicalAgeDays, correctionDays } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(chronologicalAgeDays) &&
        chronologicalAgeDays >= 0 &&
        chronologicalAgeDays <= Number.MAX_SAFE_INTEGER,
      "chronologicalAgeDays",
    ),
      chronologicalAgeDays);
    (H.domain(
      Number.isSafeInteger(correctionDays) &&
        correctionDays >= 0 &&
        correctionDays <= Number.MAX_SAFE_INTEGER,
      "correctionDays",
    ),
      correctionDays);
    return {
      correctedAgeDays: chronologicalAgeDays - correctionDays,
      correctionApplied: correctionDays !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chronologicalAgeDays: 100, correctionDays: 28 },
  output: { correctedAgeDays: 72, correctionApplied: true },
} satisfies ToolExample<Input, Output>;
export const infantAgeCorrectionRecordFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/infant-age-correction-record-field",
    title: "Infant Age Correction Record Field",
    description:
      "Subtract an explicitly supplied age correction from recorded chronological days without determining whether correction is clinically appropriate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chronologicalAgeDays: { type: "integer", minimum: 0 },
        correctionDays: { type: "integer", minimum: 0 },
      },
      required: ["chronologicalAgeDays", "correctionDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedAgeDays: { type: "integer" },
        correctionApplied: { type: "boolean" },
      },
      required: ["correctedAgeDays", "correctionApplied"],
    },
    ports: {
      inputs: [
        {
          id: "chronologicalAgeDays",
          label: "Chronological Age Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "correctionDays",
          label: "Correction Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "correctedAgeDays",
          label: "Corrected Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "correctionApplied",
          label: "Correction Applied",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = infantAgeCorrectionRecordFieldTool.execute;
export default infantAgeCorrectionRecordFieldTool;
