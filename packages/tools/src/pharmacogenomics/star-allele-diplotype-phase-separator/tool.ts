import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly firstAllele: string;
  readonly secondAllele: string;
  readonly separator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAllele: { type: "string", maxLength: 8192 },
    secondAllele: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["firstAllele", "secondAllele", "separator"],
} as const;
/** Split a simple two-star-allele diplotype subset without inferring haplotypes or function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match =
      /^(\*[1-9]\d*(?:\.\d+)?)\/(\*[1-9]\d*(?:\.\d+)?)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    return { firstAllele: match[1], secondAllele: match[2], separator: "/" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "*1/*4" },
  output: { firstAllele: "*1", secondAllele: "*4", separator: "/" },
} satisfies ToolExample<Input, Output>;
export const starAlleleDiplotypePhaseSeparatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/star-allele-diplotype-phase-separator",
    title: "Star Allele Diplotype Phase Separator Tool",
    description:
      "Split a simple two-star-allele diplotype subset without inferring haplotypes or function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAllele: { type: "string", maxLength: 8192 },
        secondAllele: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["firstAllele", "secondAllele", "separator"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "firstAllele",
          label: "First Allele",
          valueType: { type: "string" },
        },
        {
          id: "secondAllele",
          label: "Second Allele",
          valueType: { type: "string" },
        },
        { id: "separator", label: "Separator", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = starAlleleDiplotypePhaseSeparatorTool.execute;
export default starAlleleDiplotypePhaseSeparatorTool;
