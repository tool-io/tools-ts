import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly romanizedName: string };
export type Output = { readonly searchVariant: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { romanizedName: { type: "string", maxLength: 8192 } },
  required: ["romanizedName"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { searchVariant: { type: "string", maxLength: 8192 } },
  required: ["searchVariant"],
} as const;
/** Remove ASCII hyphens from a caller-supplied romanized Korean display name for a search variant while preserving spaces and case. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { romanizedName } = request;
  const compute = (): Output => {
    return { searchVariant: romanizedName.replace(/-/g, "") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { romanizedName: "Kim Min-su" },
  output: { searchVariant: "Kim Minsu" },
} satisfies ToolExample<Input, Output>;
export const koreanNameHyphenSearchVariantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/korean-name-hyphen-search-variant",
    title: "Korean Name Hyphen Search Variant Tool",
    description:
      "Remove ASCII hyphens from a caller-supplied romanized Korean display name for a search variant while preserving spaces and case.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { romanizedName: { type: "string", maxLength: 8192 } },
      required: ["romanizedName"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { searchVariant: { type: "string", maxLength: 8192 } },
      required: ["searchVariant"],
    },
    ports: {
      inputs: [
        {
          id: "romanizedName",
          label: "Romanized Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "searchVariant",
          label: "Search Variant",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = koreanNameHyphenSearchVariantTool.execute;
export default koreanNameHyphenSearchVariantTool;
