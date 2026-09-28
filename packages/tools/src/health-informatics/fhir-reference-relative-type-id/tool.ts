import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string };
export type Output = {
  readonly resourceType: string;
  readonly logicalId: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceType: { type: "string", maxLength: 8192 },
    logicalId: { type: "string", maxLength: 8192 },
  },
  required: ["resourceType", "logicalId"],
} as const;
/** Parse an unversioned two-segment relative FHIR reference without accepting absolute URLs, fragments or history suffixes; resource type vocabulary is not looked up. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference } = request;
  const compute = (): Output => {
    const match = /^([A-Z][A-Za-z0-9]*)\/([A-Za-z0-9.-]{1,64})(?![\s\S])/.exec(
      reference,
    );
    H.domain(match, "reference");
    return { resourceType: match[1], logicalId: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "Patient/001-A" },
  output: { resourceType: "Patient", logicalId: "001-A" },
} satisfies ToolExample<Input, Output>;
export const fhirReferenceRelativeTypeIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-reference-relative-type-id",
    title: "FHIR Reference Relative Type ID Tool",
    description:
      "Parse an unversioned two-segment relative FHIR reference without accepting absolute URLs, fragments or history suffixes; resource type vocabulary is not looked up.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resourceType: { type: "string", maxLength: 8192 },
        logicalId: { type: "string", maxLength: 8192 },
      },
      required: ["resourceType", "logicalId"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "resourceType",
          label: "Resource Type",
          valueType: { type: "string" },
        },
        { id: "logicalId", label: "Logical Id", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fhirReferenceRelativeTypeIdTool.execute;
export default fhirReferenceRelativeTypeIdTool;
