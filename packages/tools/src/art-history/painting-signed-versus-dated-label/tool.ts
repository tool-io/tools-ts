import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly signatureRecorded: boolean;
  readonly dateInscriptionRecorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    signatureRecorded: { type: "boolean" },
    dateInscriptionRecorded: { type: "boolean" },
  },
  required: ["objectId", "signatureRecorded", "dateInscriptionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit signature and date-inscription recording flags without authenticating authorship or dating a painting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, signatureRecorded, dateInscriptionRecorded } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    return {
      label:
        objectId +
        " [" +
        (signatureRecorded ? "signed" : "signature not recorded") +
        "; " +
        (dateInscriptionRecorded ? "dated" : "date inscription not recorded") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectId: "OBJ17",
    signatureRecorded: true,
    dateInscriptionRecorded: false,
  },
  output: { label: "OBJ17 [signed; date inscription not recorded]" },
} satisfies ToolExample<Input, Output>;
export const paintingSignedVersusDatedLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-history", "art history", "arts and design"],
      keywords: ["art history", "arts and design"],
    },
    id: "art-history/painting-signed-versus-dated-label",
    title: "Painting Signed Versus Dated Label",
    description:
      "Label explicit signature and date-inscription recording flags without authenticating authorship or dating a painting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        signatureRecorded: { type: "boolean" },
        dateInscriptionRecorded: { type: "boolean" },
      },
      required: ["objectId", "signatureRecorded", "dateInscriptionRecorded"],
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
          id: "objectId",
          label: "Object Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signatureRecorded",
          label: "Signature Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "dateInscriptionRecorded",
          label: "Date Inscription Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = paintingSignedVersusDatedLabelTool.execute;
export default paintingSignedVersusDatedLabelTool;
