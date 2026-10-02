import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly allele: string;
  readonly copies: number;
  readonly known: boolean;
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
    allele: { type: "string", maxLength: 8192 },
    copies: { type: "integer" },
    known: { type: "boolean" },
  },
  required: ["allele", "copies", "known"],
} as const;
/** Parse an explicit star-allele copy token; copies is zero when the copy number is unknown. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^(\*[1-9]\d*)(?:[x×]([1-9]\d*|N))(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const known = match[2] !== "N",
      copies = known ? Number(match[2]) : 0;
    if (known) H.integer(copies, 1);
    return { allele: match[1], copies, known };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "*2×3" },
  output: { allele: "*2", copies: 3, known: true },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneCopyNumberTokenFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/pharmacogene-copy-number-token-field",
    title: "Pharmacogene Copy Number Token Field Tool",
    description:
      "Parse an explicit star-allele copy token; copies is zero when the copy number is unknown.",
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
        allele: { type: "string", maxLength: 8192 },
        copies: { type: "integer" },
        known: { type: "boolean" },
      },
      required: ["allele", "copies", "known"],
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
        { id: "allele", label: "Allele", valueType: { type: "string" } },
        { id: "copies", label: "Copies", valueType: { type: "integer" } },
        { id: "known", label: "Known", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacogeneCopyNumberTokenFieldTool.execute;
export default pharmacogeneCopyNumberTokenFieldTool;
