import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldIds: readonly string[];
  readonly recordedValues: readonly string[];
  readonly sourceValues: readonly string[];
  readonly missingToken: string;
};
export type Output = {
  readonly matched: number;
  readonly mismatched: number;
  readonly missingRecorded: number;
  readonly missingSource: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedValues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceValues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingToken: { type: "string", maxLength: 8192 },
  },
  required: ["fieldIds", "recordedValues", "sourceValues", "missingToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matched: { type: "integer" },
    mismatched: { type: "integer" },
    missingRecorded: { type: "integer" },
    missingSource: { type: "integer" },
  },
  required: ["matched", "mismatched", "missingRecorded", "missingSource"],
} as const;
/** Calculate maternal record source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldIds, recordedValues, sourceValues, missingToken } = request;
  const compute = (): Output => {
    H.sameLength(fieldIds, recordedValues);
    H.sameLength(fieldIds, sourceValues);
    H.domain(new Set(fieldIds).size === fieldIds.length);
    return {
      matched: fieldIds.filter(
        (x, i) =>
          recordedValues[i] !== missingToken &&
          sourceValues[i] !== missingToken &&
          recordedValues[i] === sourceValues[i],
      ).length,
      mismatched: fieldIds.filter(
        (x, i) =>
          recordedValues[i] !== missingToken &&
          sourceValues[i] !== missingToken &&
          recordedValues[i] !== sourceValues[i],
      ).length,
      missingRecorded: recordedValues.filter((x) => x === missingToken).length,
      missingSource: sourceValues.filter((x) => x === missingToken).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fieldIds: ["a", "b"],
    recordedValues: ["1", "?"],
    sourceValues: ["1", "2"],
    missingToken: "?",
  },
  output: { matched: 1, mismatched: 0, missingRecorded: 1, missingSource: 0 },
} satisfies ToolExample<Input, Output>;
export const maternalRecordSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/maternal-record-source-gap",
    title: "Maternal Record Source Gap Tool",
    description:
      "Calculate maternal record source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedValues: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceValues: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingToken: { type: "string", maxLength: 8192 },
      },
      required: ["fieldIds", "recordedValues", "sourceValues", "missingToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matched: { type: "integer" },
        mismatched: { type: "integer" },
        missingRecorded: { type: "integer" },
        missingSource: { type: "integer" },
      },
      required: ["matched", "mismatched", "missingRecorded", "missingSource"],
    },
    ports: {
      inputs: [
        {
          id: "fieldIds",
          label: "Field Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordedValues",
          label: "Recorded Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceValues",
          label: "Source Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingToken",
          label: "Missing Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matched", label: "Matched", valueType: { type: "integer" } },
        {
          id: "mismatched",
          label: "Mismatched",
          valueType: { type: "integer" },
        },
        {
          id: "missingRecorded",
          label: "Missing Recorded",
          valueType: { type: "integer" },
        },
        {
          id: "missingSource",
          label: "Missing Source",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = maternalRecordSourceGapTool.execute;
export default maternalRecordSourceGapTool;
