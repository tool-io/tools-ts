import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string };
export type Output = {
  readonly resourceType: string;
  readonly id: string;
  readonly version: string;
  readonly versioned: boolean;
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
    id: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    versioned: { type: "boolean" },
  },
  required: ["resourceType", "id", "version", "versioned"],
} as const;
/** Parse the relative resource/id/history FHIR-reference subset without resolving a server or validating resource-type membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference } = request;
  const compute = (): Output => {
    const match =
      /^([A-Z][A-Za-z]+)\/([A-Za-z0-9.-]{1,64})(?:\/_history\/([A-Za-z0-9.-]{1,64}))?(?![\s\S])/.exec(
        reference,
      );
    H.domain(match, "reference");
    return {
      resourceType: match[1],
      id: match[2],
      version: match[3] ?? "",
      versioned: match[3] !== undefined,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "Patient/abc-1/_history/v2" },
  output: {
    resourceType: "Patient",
    id: "abc-1",
    version: "v2",
    versioned: true,
  },
} satisfies ToolExample<Input, Output>;
export const fhirReferenceVersionHistoryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-reference-version-history-token",
    title: "FHIR Reference Version History Token Tool",
    description:
      "Parse the relative resource/id/history FHIR-reference subset without resolving a server or validating resource-type membership.",
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
        id: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
        versioned: { type: "boolean" },
      },
      required: ["resourceType", "id", "version", "versioned"],
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
        { id: "id", label: "Id", valueType: { type: "string" } },
        { id: "version", label: "Version", valueType: { type: "string" } },
        { id: "versioned", label: "Versioned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fhirReferenceVersionHistoryTokenTool.execute;
export default fhirReferenceVersionHistoryTokenTool;
