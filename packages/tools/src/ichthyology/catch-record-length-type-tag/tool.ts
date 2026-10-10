import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catchRecordId: string;
  readonly lengthText: string;
  readonly lengthDefinition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catchRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    lengthText: { type: "string", maxLength: 8192, minLength: 1 },
    lengthDefinition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["catchRecordId", "lengthText", "lengthDefinition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit fish catch length transcription and measurement definition without converting length types. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catchRecordId, lengthText, lengthDefinition } = request;
  const compute = (): Output => {
    H.domain(catchRecordId.length > 0, "catchRecordId");
    H.domain(lengthText.length > 0, "lengthText");
    H.domain(lengthDefinition.length > 0, "lengthDefinition");
    return {
      token: JSON.stringify([catchRecordId, lengthText, lengthDefinition]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    catchRecordId: "C17",
    lengthText: "120 mm",
    lengthDefinition: "standard length",
  },
  output: { token: '["C17","120 mm","standard length"]' },
} satisfies ToolExample<Input, Output>;
export const catchRecordLengthTypeTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/catch-record-length-type-tag",
    title: "Catch Record Length Type Tag Tool",
    description:
      "Preserve explicit fish catch length transcription and measurement definition without converting length types.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        catchRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        lengthText: { type: "string", maxLength: 8192, minLength: 1 },
        lengthDefinition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["catchRecordId", "lengthText", "lengthDefinition"],
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
          id: "catchRecordId",
          label: "Catch Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lengthText",
          label: "Length Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lengthDefinition",
          label: "Length Definition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = catchRecordLengthTypeTagTool.execute;
export default catchRecordLengthTypeTagTool;
