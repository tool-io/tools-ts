import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly alleleToken: string };
export type Output = {
  readonly alleleNumberText: string;
  readonly suballeleText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { alleleToken: { type: "string", maxLength: 8192 } },
  required: ["alleleToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alleleNumberText: { type: "string", maxLength: 8192 },
    suballeleText: { type: "string", maxLength: 8192 },
  },
  required: ["alleleNumberText", "suballeleText"],
} as const;
/** Split a supplied numeric star-allele label into its number and optional suballele text without recognizing an allele definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alleleToken } = request;
  const compute = (): Output => {
    H.domain(
      /^\*[1-9][0-9]*(?:\.[0-9]+)?(?![\s\S])/.test(alleleToken),
      "alleleToken",
    );
    const parts = alleleToken.slice(1).split(".");
    return { alleleNumberText: parts[0], suballeleText: parts[1] ?? "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alleleToken: "*4.001" },
  output: { alleleNumberText: "4", suballeleText: "001" },
} satisfies ToolExample<Input, Output>;
export const starAlleleTokenParserTool = H.defineSchemaCalculation<
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
    id: "pharmacogenomics/star-allele-token-parser",
    title: "Star Allele Token Parser",
    description:
      "Split a supplied numeric star-allele label into its number and optional suballele text without recognizing an allele definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { alleleToken: { type: "string", maxLength: 8192 } },
      required: ["alleleToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alleleNumberText: { type: "string", maxLength: 8192 },
        suballeleText: { type: "string", maxLength: 8192 },
      },
      required: ["alleleNumberText", "suballeleText"],
    },
    ports: {
      inputs: [
        {
          id: "alleleToken",
          label: "Allele Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "alleleNumberText",
          label: "Allele Number Text",
          valueType: { type: "string" },
        },
        {
          id: "suballeleText",
          label: "Suballele Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = starAlleleTokenParserTool.execute;
export default starAlleleTokenParserTool;
