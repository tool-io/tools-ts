import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly suppliedQualifiers: readonly string[];
};
export type Output = { readonly recognized: boolean; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    suppliedQualifiers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["token", "suppliedQualifiers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recognized: { type: "boolean" }, index: { type: "integer" } },
  required: ["recognized", "index"],
} as const;
/** Match explicit evidence-language qualifiers without validating a product claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, suppliedQualifiers } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedQualifiers).size === suppliedQualifiers.length);
    return {
      recognized: suppliedQualifiers.includes(token),
      index: suppliedQualifiers.indexOf(token),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "uncertain", suppliedQualifiers: ["uncertain", "reported"] },
  output: { recognized: true, index: 0 },
} satisfies ToolExample<Input, Output>;
export const evidenceClaimQualifierTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/evidence-claim-qualifier-token",
    title: "Evidence Claim Qualifier Token Tool",
    description:
      "Match explicit evidence-language qualifiers without validating a product claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        suppliedQualifiers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["token", "suppliedQualifiers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        index: { type: "integer" },
      },
      required: ["recognized", "index"],
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
          id: "suppliedQualifiers",
          label: "Supplied Qualifiers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = evidenceClaimQualifierTokenTool.execute;
export default evidenceClaimQualifierTokenTool;
