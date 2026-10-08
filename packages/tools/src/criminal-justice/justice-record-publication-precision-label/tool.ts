import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCode: string;
  readonly datePrecision: string;
  readonly locationPrecision: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCode: { type: "string", maxLength: 8192, minLength: 1 },
    datePrecision: { type: "string", maxLength: 8192, minLength: 1 },
    locationPrecision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordCode", "datePrecision", "locationPrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly selected publication precision metadata without deciding disclosure law or anonymizing a record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCode, datePrecision, locationPrecision } = request;
  const compute = (): Output => {
    H.domain(
      recordCode.length > 0 &&
        datePrecision.length > 0 &&
        locationPrecision.length > 0,
      "recordCode",
    );
    return {
      label:
        recordCode +
        "; date precision=" +
        datePrecision +
        "; location precision=" +
        locationPrecision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordCode: "R17",
    datePrecision: "month",
    locationPrecision: "district",
  },
  output: { label: "R17; date precision=month; location precision=district" },
} satisfies ToolExample<Input, Output>;
export const justiceRecordPublicationPrecisionLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["criminal-justice", "criminal justice", "social sciences"],
        keywords: ["criminal justice", "social sciences"],
      },
      id: "criminal-justice/justice-record-publication-precision-label",
      title: "Justice Record Publication Precision Label",
      description:
        "Label explicitly selected publication precision metadata without deciding disclosure law or anonymizing a record.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordCode: { type: "string", maxLength: 8192, minLength: 1 },
          datePrecision: { type: "string", maxLength: 8192, minLength: 1 },
          locationPrecision: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordCode", "datePrecision", "locationPrecision"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "recordCode",
            label: "Record Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "datePrecision",
            label: "Date Precision",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "locationPrecision",
            label: "Location Precision",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = justiceRecordPublicationPrecisionLabelTool.execute;
export default justiceRecordPublicationPrecisionLabelTool;
