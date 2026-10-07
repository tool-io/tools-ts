import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly header: string };
export type Output = {
  readonly accession: string;
  readonly description: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { header: { type: "string", maxLength: 8192 } },
  required: ["header"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accession: { type: "string", maxLength: 8192 },
    description: { type: "string", maxLength: 8192 },
  },
  required: ["accession", "description"],
} as const;
/** Split one FASTA definition line into the first whitespace-delimited identifier and remaining literal description without resolving an accession registry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { header } = request;
  const compute = (): Output => {
    H.domain(header.startsWith(">") && !/[\r\n]/.test(header), "header");
    const match = /^>([^\s]+)(?:[ \t]+(.*))?(?![\s\S])/.exec(header);
    H.domain(match, "header");
    return { accession: match[1], description: match[2] ?? "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { header: ">SEQ17 sample description" },
  output: { accession: "SEQ17", description: "sample description" },
} satisfies ToolExample<Input, Output>;
export const fastaHeaderAccessionSplitTool = H.defineSchemaCalculation<
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
    id: "bioinformatics/fasta-header-accession-split",
    title: "FASTA Header Accession Split",
    description:
      "Split one FASTA definition line into the first whitespace-delimited identifier and remaining literal description without resolving an accession registry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { header: { type: "string", maxLength: 8192 } },
      required: ["header"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accession: { type: "string", maxLength: 8192 },
        description: { type: "string", maxLength: 8192 },
      },
      required: ["accession", "description"],
    },
    ports: {
      inputs: [
        {
          id: "header",
          label: "Header",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "accession", label: "Accession", valueType: { type: "string" } },
        {
          id: "description",
          label: "Description",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = fastaHeaderAccessionSplitTool.execute;
export default fastaHeaderAccessionSplitTool;
