import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as readReference } from "../../health-informatics/fhir-reference-version-history-token/tool.js";
export type Input = { readonly reference: string };
export type Output = {
  readonly targetId: string;
  readonly contained: boolean;
  readonly resourceType: string;
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
    targetId: { type: "string", maxLength: 8192 },
    contained: { type: "boolean" },
    resourceType: { type: "string", maxLength: 8192 },
  },
  required: ["targetId", "contained", "resourceType"],
} as const;
/** Extract the target token from supplied contained or relative versioned FHIR references without server resolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference } = request;
  const compute = (): Output => {
    if (reference.startsWith("#")) {
      const targetId = reference.slice(1);
      H.domain(/^[A-Za-z0-9.-]{1,64}(?![\s\S])/.test(targetId), "reference");
      return { targetId, contained: true, resourceType: "" };
    }
    const p = readReference({ reference });
    return { targetId: p.id, contained: false, resourceType: p.resourceType };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "#local-1" },
  output: { targetId: "local-1", contained: true, resourceType: "" },
} satisfies ToolExample<Input, Output>;
export const fhirReferenceTargetTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-reference-target-token",
    title: "FHIR Reference Target Token Tool",
    description:
      "Extract the target token from supplied contained or relative versioned FHIR references without server resolution.",
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
        targetId: { type: "string", maxLength: 8192 },
        contained: { type: "boolean" },
        resourceType: { type: "string", maxLength: 8192 },
      },
      required: ["targetId", "contained", "resourceType"],
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
        { id: "targetId", label: "Target Id", valueType: { type: "string" } },
        { id: "contained", label: "Contained", valueType: { type: "boolean" } },
        {
          id: "resourceType",
          label: "Resource Type",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = fhirReferenceTargetTokenTool.execute;
export default fhirReferenceTargetTokenTool;
