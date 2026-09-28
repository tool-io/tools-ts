import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly system: string; readonly value: string };
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    system: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
  },
  required: ["system", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Lossless JSON tuple key for an explicit FHIR Identifier system URI and value; punctuation and leading zeros are preserved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { system, value } = request;
  const compute = (): Output => {
    H.domain(
      /^[A-Za-z][A-Za-z0-9+.-]*:/.test(system) &&
        !/[\s\u0000-\u001f\u007f]/.test(system),
      "system",
    );
    H.domain(value.length > 0, "value");
    return { key: JSON.stringify([system, value]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { system: "urn:example:mrn", value: "00123" },
  output: { key: '["urn:example:mrn","00123"]' },
} satisfies ToolExample<Input, Output>;
export const fhirIdentifierSystemValuePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-identifier-system-value-pair",
    title: "FHIR Identifier System Value Pair Tool",
    description:
      "Lossless JSON tuple key for an explicit FHIR Identifier system URI and value; punctuation and leading zeros are preserved.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        system: { type: "string", maxLength: 8192 },
        value: { type: "string", maxLength: 8192 },
      },
      required: ["system", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "system",
          label: "System",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fhirIdentifierSystemValuePairTool.execute;
export default fhirIdentifierSystemValuePairTool;
