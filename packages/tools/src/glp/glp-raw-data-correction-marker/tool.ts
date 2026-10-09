import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly correctionId: string;
  readonly reasonText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    correctionId: { type: "string", maxLength: 8192, minLength: 1 },
    reasonText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "correctionId", "reasonText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit raw-data correction marker and reason without editing or validating the source data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, correctionId, reasonText } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(correctionId.length > 0, "correctionId");
    H.domain(reasonText.length > 0, "reasonText");
    return { token: JSON.stringify([recordId, correctionId, reasonText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    correctionId: "COR2",
    reasonText: "transcription correction",
  },
  output: { token: '["R17","COR2","transcription correction"]' },
} satisfies ToolExample<Input, Output>;
export const glpRawDataCorrectionMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "glp",
        "good laboratory practice",
        "research and quality management",
      ],
      keywords: [
        "good laboratory practice",
        "research and quality management",
        "GLP",
      ],
    },
    id: "glp/glp-raw-data-correction-marker",
    title: "GLP Raw Data Correction Marker",
    description:
      "Preserve an explicit raw-data correction marker and reason without editing or validating the source data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        correctionId: { type: "string", maxLength: 8192, minLength: 1 },
        reasonText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "correctionId", "reasonText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correctionId",
          label: "Correction Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reasonText",
          label: "Reason Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glpRawDataCorrectionMarkerTool.execute;
export default glpRawDataCorrectionMarkerTool;
