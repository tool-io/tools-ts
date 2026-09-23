import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly permittedCodes: readonly string[];
  readonly source: string;
  readonly version: string;
};
export type Output = { readonly known: boolean; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    permittedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    source: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
  },
  required: ["code", "permittedCodes", "source", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "boolean" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["known", "sourceKey"],
} as const;
/** Check an explicit presentation-record code without classifying spoofing or authenticity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, permittedCodes, source, version } = request;
  const compute = (): Output => {
    H.domain(source.length > 0 && version.length > 0);
    return {
      known: permittedCodes.includes(code),
      sourceKey: JSON.stringify([source, version, code]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "A",
    permittedCodes: ["A", "B"],
    source: "protocol",
    version: "v1",
  },
  output: { known: true, sourceKey: '["protocol","v1","A"]' },
} satisfies ToolExample<Input, Output>;
export const biometricPresentationRecordCallerCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-presentation-record-caller-code",
      title: "Biometric Presentation Record Caller Code Tool",
      description:
        "Check an explicit presentation-record code without classifying spoofing or authenticity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: { type: "string", maxLength: 8192 },
          permittedCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          source: { type: "string", maxLength: 8192 },
          version: { type: "string", maxLength: 8192 },
        },
        required: ["code", "permittedCodes", "source", "version"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          known: { type: "boolean" },
          sourceKey: { type: "string", maxLength: 8192 },
        },
        required: ["known", "sourceKey"],
      },
      ports: {
        inputs: [
          {
            id: "code",
            label: "Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permittedCodes",
            label: "Permitted Codes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "version",
            label: "Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "known", label: "Known", valueType: { type: "boolean" } },
          {
            id: "sourceKey",
            label: "Source Key",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricPresentationRecordCallerCodeTool.execute;
export default biometricPresentationRecordCallerCodeTool;
