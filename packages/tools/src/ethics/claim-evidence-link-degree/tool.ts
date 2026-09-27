import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claim: string;
  readonly linkedClaims: readonly string[];
};
export type Output = { readonly degree: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claim: { type: "string", maxLength: 8192 },
    linkedClaims: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["claim", "linkedClaims"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degree: { type: "integer" } },
  required: ["degree"],
} as const;
/** Count explicit evidence-link rows incident on one claim, retaining repeated links as supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claim, linkedClaims } = request;
  const compute = (): Output => {
    return { degree: linkedClaims.filter((x) => x === claim).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claim: "a", linkedClaims: ["a", "b", "a"] },
  output: { degree: 2 },
} satisfies ToolExample<Input, Output>;
export const claimEvidenceLinkDegreeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/claim-evidence-link-degree",
    title: "Claim Evidence Link Degree Tool",
    description:
      "Count explicit evidence-link rows incident on one claim, retaining repeated links as supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claim: { type: "string", maxLength: 8192 },
        linkedClaims: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["claim", "linkedClaims"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { degree: { type: "integer" } },
      required: ["degree"],
    },
    ports: {
      inputs: [
        {
          id: "claim",
          label: "Claim",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "linkedClaims",
          label: "Linked Claims",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "degree", label: "Degree", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = claimEvidenceLinkDegreeTool.execute;
export default claimEvidenceLinkDegreeTool;
