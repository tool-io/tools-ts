import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly strand: string };
export type Output = { readonly known: boolean; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strand: { type: "string", maxLength: 8192, enum: ["+", "-", "."] },
  },
  required: ["strand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { known: { type: "boolean" }, sign: { type: "integer" } },
  required: ["known", "sign"],
} as const;
/** Map explicit +/−/unknown genomic strand notation to a signed value with a separate known flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strand } = request;
  const compute = (): Output => {
    H.domain(["+", "-", "."].includes(strand), "strand");
    return {
      known: strand !== ".",
      sign: strand === "+" ? 1 : strand === "-" ? -1 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strand: "-" },
  output: { known: true, sign: -1 },
} satisfies ToolExample<Input, Output>;
export const genomicStrandSignCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/genomic-strand-sign-crosswalk",
    title: "Genomic Strand Sign Crosswalk",
    description:
      "Map explicit +/−/unknown genomic strand notation to a signed value with a separate known flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strand: { type: "string", maxLength: 8192, enum: ["+", "-", "."] },
      },
      required: ["strand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { known: { type: "boolean" }, sign: { type: "integer" } },
      required: ["known", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "strand",
          label: "Strand",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = genomicStrandSignCrosswalkTool.execute;
export default genomicStrandSignCrosswalkTool;
