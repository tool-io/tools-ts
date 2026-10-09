import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string };
export type Output = {
  readonly resourceType: string;
  readonly resourceId: string;
  readonly versionId: string;
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
    resourceId: { type: "string", maxLength: 8192 },
    versionId: { type: "string", maxLength: 8192 },
    versioned: { type: "boolean" },
  },
  required: ["resourceType", "resourceId", "versionId", "versioned"],
} as const;
/** Split a restricted relative FHIR ResourceType/id reference with optional version history, without resolving resources, URLs, fragments, or resource-type registration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference } = request;
  const compute = (): Output => {
    const match =
      /^([A-Z][A-Za-z0-9]*)\/([A-Za-z0-9.-]{1,64})(?:\/_history\/([A-Za-z0-9.-]{1,64}))?(?![\s\S])/.exec(
        reference,
      );
    H.domain(match, "reference");
    return {
      resourceType: match[1],
      resourceId: match[2],
      versionId: match[3] ?? "",
      versioned: match[3] !== undefined,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "Patient/p17/_history/2" },
  output: {
    resourceType: "Patient",
    resourceId: "p17",
    versionId: "2",
    versioned: true,
  },
} satisfies ToolExample<Input, Output>;
export const fhirResourceIdReferenceSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/fhir-resource-id-reference-split",
    title: "FHIR Resource ID Reference Split",
    description:
      "Split a restricted relative FHIR ResourceType/id reference with optional version history, without resolving resources, URLs, fragments, or resource-type registration.",
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
        resourceId: { type: "string", maxLength: 8192 },
        versionId: { type: "string", maxLength: 8192 },
        versioned: { type: "boolean" },
      },
      required: ["resourceType", "resourceId", "versionId", "versioned"],
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
        {
          id: "resourceId",
          label: "Resource Id",
          valueType: { type: "string" },
        },
        { id: "versionId", label: "Version Id", valueType: { type: "string" } },
        { id: "versioned", label: "Versioned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fhirResourceIdReferenceSplitTool.execute;
export default fhirResourceIdReferenceSplitTool;
