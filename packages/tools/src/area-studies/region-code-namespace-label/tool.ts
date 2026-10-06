import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly namespace: string; readonly regionCode: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    namespace: { type: "string", maxLength: 8192, minLength: 1 },
    regionCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["namespace", "regionCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Display a literal region code within an explicit namespace without assigning geographic membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { namespace, regionCode } = request;
  const compute = (): Output => {
    H.domain(namespace.length > 0 && regionCode.length > 0, "namespace");
    return { label: namespace + ":" + regionCode };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { namespace: "local-regions", regionCode: "R17" },
  output: { label: "local-regions:R17" },
} satisfies ToolExample<Input, Output>;
export const regionCodeNamespaceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/region-code-namespace-label",
    title: "Region Code Namespace Label",
    description:
      "Display a literal region code within an explicit namespace without assigning geographic membership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        namespace: { type: "string", maxLength: 8192, minLength: 1 },
        regionCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["namespace", "regionCode"],
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
          id: "namespace",
          label: "Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "regionCode",
          label: "Region Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regionCodeNamespaceLabelTool.execute;
export default regionCodeNamespaceLabelTool;
