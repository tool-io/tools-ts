import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifier: string;
  readonly namespace: string;
  readonly separator: string;
};
export type Output = { readonly localToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    namespace: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["identifier", "namespace", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { localToken: { type: "string", maxLength: 8192 } },
  required: ["localToken"],
} as const;
/** Extract an opaque deidentified research identifier without diagnostic classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, namespace, separator } = request;
  const compute = (): Output => {
    H.domain(
      namespace.length > 0 &&
        separator.length > 0 &&
        identifier.startsWith(namespace + separator),
    );
    const localToken = identifier.slice(namespace.length + separator.length);
    H.domain(localToken.length > 0);
    return { localToken };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "studyA:L12", namespace: "studyA", separator: ":" },
  output: { localToken: "L12" },
} satisfies ToolExample<Input, Output>;
export const researchLesionIdTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/research-lesion-id-token",
    title: "Research Lesion ID Token Tool",
    description:
      "Extract an opaque deidentified research identifier without diagnostic classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifier: { type: "string", maxLength: 8192 },
        namespace: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["identifier", "namespace", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { localToken: { type: "string", maxLength: 8192 } },
      required: ["localToken"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
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
        {
          id: "localToken",
          label: "Local Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchLesionIdTokenTool.execute;
export default researchLesionIdTokenTool;
