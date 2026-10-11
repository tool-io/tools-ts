import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly geneLabel: string;
  readonly assemblyLabel: string;
  readonly annotationVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geneLabel: { type: "string", maxLength: 8192, minLength: 1 },
    assemblyLabel: { type: "string", maxLength: 8192, minLength: 1 },
    annotationVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["geneLabel", "assemblyLabel", "annotationVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit gene label by assembly and annotation namespace without mapping coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { geneLabel, assemblyLabel, annotationVersion } = request;
  const compute = (): Output => {
    H.domain(geneLabel.length > 0, "geneLabel");
    H.domain(assemblyLabel.length > 0, "assemblyLabel");
    H.domain(annotationVersion.length > 0, "annotationVersion");
    return {
      token: JSON.stringify([geneLabel, assemblyLabel, annotationVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    geneLabel: "GENE-A",
    assemblyLabel: "Assembly X",
    annotationVersion: "v2",
  },
  output: { token: '["GENE-A","Assembly X","v2"]' },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneBuildNamespaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacogenomics", "pharmacy"],
      keywords: ["pharmacogenomics", "pharmacy"],
    },
    id: "pharmacogenomics/pharmacogene-build-namespace",
    title: "Pharmacogene Build Namespace",
    description:
      "Qualify an explicit gene label by assembly and annotation namespace without mapping coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geneLabel: { type: "string", maxLength: 8192, minLength: 1 },
        assemblyLabel: { type: "string", maxLength: 8192, minLength: 1 },
        annotationVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["geneLabel", "assemblyLabel", "annotationVersion"],
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
          id: "geneLabel",
          label: "Gene Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assemblyLabel",
          label: "Assembly Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "annotationVersion",
          label: "Annotation Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pharmacogeneBuildNamespaceTool.execute;
export default pharmacogeneBuildNamespaceTool;
