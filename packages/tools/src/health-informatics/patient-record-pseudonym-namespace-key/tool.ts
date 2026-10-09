import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly namespace: string;
  readonly suppliedPseudonym: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    namespace: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["namespace", "suppliedPseudonym"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Namespace an explicitly supplied patient-record pseudonym without generating identifiers or promising deidentification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { namespace, suppliedPseudonym } = request;
  const compute = (): Output => {
    H.domain(namespace.length > 0, "namespace");
    H.domain(suppliedPseudonym.length > 0, "suppliedPseudonym");
    return { token: JSON.stringify([namespace, suppliedPseudonym]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { namespace: "N17", suppliedPseudonym: "P00024" },
  output: { token: '["N17","P00024"]' },
} satisfies ToolExample<Input, Output>;
export const patientRecordPseudonymNamespaceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/patient-record-pseudonym-namespace-key",
    title: "Patient Record Pseudonym Namespace Key Tool",
    description:
      "Namespace an explicitly supplied patient-record pseudonym without generating identifiers or promising deidentification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        namespace: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["namespace", "suppliedPseudonym"],
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
          id: "namespace",
          label: "Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPseudonym",
          label: "Supplied Pseudonym",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = patientRecordPseudonymNamespaceKeyTool.execute;
export default patientRecordPseudonymNamespaceKeyTool;
