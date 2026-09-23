import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cigar: string };
export type Output = { readonly skippedReference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cigar: { type: "string", maxLength: 8192 } },
  required: ["cigar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { skippedReference: { type: "integer" } },
  required: ["skippedReference"],
} as const;
/** Sum only CIGAR N reference-skip lengths; D deletions and other reference-consuming operations are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cigar } = request;
  const compute = (): Output => {
    H.domain(
      /^(?:[1-9]\d*[MIDNSHP=X])+(?![\s\S])/.test(cigar),
      "cigar",
      "Use positive lengths and supported CIGAR operation tokens.",
    );
    let skippedReference = 0;
    for (const t of cigar.matchAll(/(\d+)([MIDNSHP=X])/g)) {
      const n = Number(t[1]);
      H.integer(n, 1);
      if (t[2] === "N") skippedReference += n;
    }
    return { skippedReference };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cigar: "6M14N5M" },
  output: { skippedReference: 14 },
} satisfies ToolExample<Input, Output>;
export const cigarSkippedReferenceLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/cigar-skipped-reference-length",
    title: "CIGAR Skipped Reference Length Tool",
    description:
      "Sum only CIGAR N reference-skip lengths; D deletions and other reference-consuming operations are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cigar: { type: "string", maxLength: 8192 } },
      required: ["cigar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { skippedReference: { type: "integer" } },
      required: ["skippedReference"],
    },
    ports: {
      inputs: [
        {
          id: "cigar",
          label: "Cigar",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "skippedReference",
          label: "Skipped Reference",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = cigarSkippedReferenceLengthTool.execute;
export default cigarSkippedReferenceLengthTool;
