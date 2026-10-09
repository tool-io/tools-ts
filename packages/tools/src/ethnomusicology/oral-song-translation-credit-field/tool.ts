import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly suppliedTranslatorCredit: string;
  readonly permissionReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTranslatorCredit: { type: "string", maxLength: 8192, minLength: 1 },
    permissionReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordingId", "suppliedTranslatorCredit", "permissionReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit oral-song translation credit and permission reference without translating or asserting publication rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, suppliedTranslatorCredit, permissionReference } =
    request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0, "recordingId");
    H.domain(suppliedTranslatorCredit.length > 0, "suppliedTranslatorCredit");
    H.domain(permissionReference.length > 0, "permissionReference");
    return {
      token: JSON.stringify([
        recordingId,
        suppliedTranslatorCredit,
        permissionReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingId: "R17",
    suppliedTranslatorCredit: "Translator A",
    permissionReference: "P4",
  },
  output: { token: '["R17","Translator A","P4"]' },
} satisfies ToolExample<Input, Output>;
export const oralSongTranslationCreditFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/oral-song-translation-credit-field",
    title: "Oral Song Translation Credit Field Tool",
    description:
      "Preserve an explicit oral-song translation credit and permission reference without translating or asserting publication rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordingId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTranslatorCredit: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        permissionReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "recordingId",
        "suppliedTranslatorCredit",
        "permissionReference",
      ],
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
          id: "recordingId",
          label: "Recording Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTranslatorCredit",
          label: "Supplied Translator Credit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permissionReference",
          label: "Permission Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralSongTranslationCreditFieldTool.execute;
export default oralSongTranslationCreditFieldTool;
