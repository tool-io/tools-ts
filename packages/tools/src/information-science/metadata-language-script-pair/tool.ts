import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedLanguage: string;
  readonly suppliedScript: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedScript: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedLanguage", "suppliedScript"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit metadata language and script tags without detecting text or consulting a code registry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedLanguage, suppliedScript } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedLanguage.length > 0, "suppliedLanguage");
    H.domain(suppliedScript.length > 0, "suppliedScript");
    return {
      token: JSON.stringify([recordId, suppliedLanguage, suppliedScript]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", suppliedLanguage: "en", suppliedScript: "Latn" },
  output: { token: '["R17","en","Latn"]' },
} satisfies ToolExample<Input, Output>;
export const metadataLanguageScriptPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/metadata-language-script-pair",
    title: "Metadata Language Script Pair Tool",
    description:
      "Preserve explicit metadata language and script tags without detecting text or consulting a code registry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedScript: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedLanguage", "suppliedScript"],
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
          id: "suppliedLanguage",
          label: "Supplied Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedScript",
          label: "Supplied Script",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = metadataLanguageScriptPairTool.execute;
export default metadataLanguageScriptPairTool;
