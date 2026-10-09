import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unitCode: string;
  readonly namespace: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitCode: { type: "string", maxLength: 8192, minLength: 1 },
    namespace: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["unitCode", "namespace", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record the explicit namespace and version of a clinical unit code without validating unit semantics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitCode, namespace, version } = request;
  const compute = (): Output => {
    H.domain(unitCode.length > 0, "unitCode");
    H.domain(namespace.length > 0, "namespace");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([unitCode, namespace, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    unitCode: "mg",
    namespace: "http://unitsofmeasure.org",
    version: "2.2",
  },
  output: { token: '["mg","http://unitsofmeasure.org","2.2"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalUnitCodeNamespaceLabelTool = H.defineSchemaCalculation<
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
    id: "health-informatics/clinical-unit-code-namespace-label",
    title: "Clinical Unit Code Namespace Label",
    description:
      "Record the explicit namespace and version of a clinical unit code without validating unit semantics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitCode: { type: "string", maxLength: 8192, minLength: 1 },
        namespace: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["unitCode", "namespace", "version"],
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
          id: "unitCode",
          label: "Unit Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "namespace",
          label: "Namespace",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalUnitCodeNamespaceLabelTool.execute;
export default clinicalUnitCodeNamespaceLabelTool;
