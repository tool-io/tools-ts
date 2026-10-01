import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly namespace: string;
  readonly separator: string;
};
export type Output = { readonly eraToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    namespace: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["token", "namespace", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eraToken: { type: "string", maxLength: 8192 } },
  required: ["eraToken"],
} as const;
/** Extract an opaque deidentified registry-era token without a disease classification table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, namespace, separator } = request;
  const compute = (): Output => {
    H.domain(
      namespace.length > 0 &&
        separator.length > 0 &&
        token.startsWith(namespace + separator),
    );
    const eraToken = token.slice(namespace.length + separator.length);
    H.domain(eraToken.length > 0);
    return { eraToken };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "registry:v2", namespace: "registry", separator: ":" },
  output: { eraToken: "v2" },
} satisfies ToolExample<Input, Output>;
export const tumorRegistryEraTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/tumor-registry-era-token",
    title: "Tumor Registry Era Token Tool",
    description:
      "Extract an opaque deidentified registry-era token without a disease classification table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        namespace: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["token", "namespace", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eraToken: { type: "string", maxLength: 8192 } },
      required: ["eraToken"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
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
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "eraToken", label: "Era Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = tumorRegistryEraTokenTool.execute;
export default tumorRegistryEraTokenTool;
