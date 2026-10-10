import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly dateText: string;
  readonly suppliedQualifier: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedQualifier: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "dateText", "suppliedQualifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit bibliographic date transcription and uncertainty qualifier without constructing missing date fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, dateText, suppliedQualifier } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(dateText.length > 0, "dateText");
    H.domain(suppliedQualifier.length > 0, "suppliedQualifier");
    return { token: JSON.stringify([recordId, dateText, suppliedQualifier]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", dateText: "1900", suppliedQualifier: "circa" },
  output: { token: '["R17","1900","circa"]' },
} satisfies ToolExample<Input, Output>;
export const bibliographicDateUncertaintyQualifierTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/bibliographic-date-uncertainty-qualifier",
      title: "Bibliographic Date Uncertainty Qualifier Tool",
      description:
        "Preserve explicit bibliographic date transcription and uncertainty qualifier without constructing missing date fields.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          dateText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedQualifier: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "dateText", "suppliedQualifier"],
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
            id: "dateText",
            label: "Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedQualifier",
            label: "Supplied Qualifier",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = bibliographicDateUncertaintyQualifierTool.execute;
export default bibliographicDateUncertaintyQualifierTool;
