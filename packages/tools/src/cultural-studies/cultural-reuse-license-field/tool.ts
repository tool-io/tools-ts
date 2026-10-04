import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly licenseIdentifier: string;
  readonly attributionRequired: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192 },
    licenseIdentifier: { type: "string", maxLength: 8192 },
    attributionRequired: { type: "boolean" },
  },
  required: ["workId", "licenseIdentifier", "attributionRequired"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render supplied reuse-license metadata without interpreting license terms or asserting permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, licenseIdentifier, attributionRequired } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0 && licenseIdentifier.length > 0, "workId");
    return {
      label:
        workId +
        "; license=" +
        licenseIdentifier +
        "; attribution=" +
        (attributionRequired ? "required" : "not specified"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workId: "W-17",
    licenseIdentifier: "CC-BY-4.0",
    attributionRequired: true,
  },
  output: { label: "W-17; license=CC-BY-4.0; attribution=required" },
} satisfies ToolExample<Input, Output>;
export const culturalReuseLicenseFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/cultural-reuse-license-field",
    title: "Cultural Reuse License Field Tool",
    description:
      "Render supplied reuse-license metadata without interpreting license terms or asserting permission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workId: { type: "string", maxLength: 8192 },
        licenseIdentifier: { type: "string", maxLength: 8192 },
        attributionRequired: { type: "boolean" },
      },
      required: ["workId", "licenseIdentifier", "attributionRequired"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "workId",
          label: "Work Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "licenseIdentifier",
          label: "License Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "attributionRequired",
          label: "Attribution Required",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = culturalReuseLicenseFieldTool.execute;
export default culturalReuseLicenseFieldTool;
