import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cigar: string };
export type Output = { readonly softClipped: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cigar: { type: "string", maxLength: 8192 } },
  required: ["cigar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { softClipped: { type: "integer" } },
  required: ["softClipped"],
} as const;
/** Sum S operation lengths in a supplied CIGAR operation stream; alignment-level clipping placement checks are separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cigar } = request;
  const compute = (): Output => {
    H.domain(
      /^(?:[1-9]\d*[MIDNSHP=X])+(?![\s\S])/.test(cigar),
      "cigar",
      "Use positive lengths and supported CIGAR operation tokens.",
    );
    let softClipped = 0;
    for (const t of cigar.matchAll(/(\d+)([MIDNSHP=X])/g)) {
      const n = Number(t[1]);
      H.integer(n, 1);
      if (t[2] === "S") softClipped += n;
    }
    return { softClipped };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cigar: "3S6M1P1I4M" },
  output: { softClipped: 3 },
} satisfies ToolExample<Input, Output>;
export const cigarSoftClipLengthTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "bioinformatics/cigar-soft-clip-length",
      title: "CIGAR Soft Clip Length Tool",
      description:
        "Sum S operation lengths in a supplied CIGAR operation stream; alignment-level clipping placement checks are separate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cigar: { type: "string", maxLength: 8192 } },
        required: ["cigar"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { softClipped: { type: "integer" } },
        required: ["softClipped"],
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
            id: "softClipped",
            label: "Soft Clipped",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = cigarSoftClipLengthTool.execute;
export default cigarSoftClipLengthTool;
