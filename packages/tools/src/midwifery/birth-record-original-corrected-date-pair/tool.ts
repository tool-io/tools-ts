import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalDay: number;
  readonly correctedDay: number;
  readonly correctionId: string;
  readonly originalId: string;
  readonly parentId: string;
};
export type Output = {
  readonly differenceDays: number;
  readonly linked: boolean;
  readonly changesDate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalDay: { type: "integer" },
    correctedDay: { type: "integer" },
    correctionId: { type: "string", maxLength: 8192 },
    originalId: { type: "string", maxLength: 8192 },
    parentId: { type: "string", maxLength: 8192 },
  },
  required: [
    "originalDay",
    "correctedDay",
    "correctionId",
    "originalId",
    "parentId",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differenceDays: { type: "integer" },
    linked: { type: "boolean" },
    changesDate: { type: "boolean" },
  },
  required: ["differenceDays", "linked", "changesDate"],
} as const;
/** Audit explicit original/corrected day indices and their source link. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalDay, correctedDay, correctionId, originalId, parentId } =
    request;
  const compute = (): Output => {
    H.domain(
      correctionId.length > 0 && originalId.length > 0 && parentId.length > 0,
    );
    return {
      differenceDays: correctedDay - originalDay,
      linked: originalId === parentId,
      changesDate: correctedDay !== originalDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalDay: 100,
    correctedDay: 101,
    correctionId: "C1",
    originalId: "R1",
    parentId: "R1",
  },
  output: { differenceDays: 1, linked: true, changesDate: true },
} satisfies ToolExample<Input, Output>;
export const birthRecordOriginalCorrectedDatePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "midwifery/birth-record-original-corrected-date-pair",
      title: "Birth Record Original Corrected Date Pair Tool",
      description:
        "Audit explicit original/corrected day indices and their source link.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalDay: { type: "integer" },
          correctedDay: { type: "integer" },
          correctionId: { type: "string", maxLength: 8192 },
          originalId: { type: "string", maxLength: 8192 },
          parentId: { type: "string", maxLength: 8192 },
        },
        required: [
          "originalDay",
          "correctedDay",
          "correctionId",
          "originalId",
          "parentId",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          differenceDays: { type: "integer" },
          linked: { type: "boolean" },
          changesDate: { type: "boolean" },
        },
        required: ["differenceDays", "linked", "changesDate"],
      },
      ports: {
        inputs: [
          {
            id: "originalDay",
            label: "Original Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "correctedDay",
            label: "Corrected Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "correctionId",
            label: "Correction Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalId",
            label: "Original Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "parentId",
            label: "Parent Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "differenceDays",
            label: "Difference Days",
            valueType: { type: "integer" },
          },
          { id: "linked", label: "Linked", valueType: { type: "boolean" } },
          {
            id: "changesDate",
            label: "Changes Date",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = birthRecordOriginalCorrectedDatePairTool.execute;
export default birthRecordOriginalCorrectedDatePairTool;
