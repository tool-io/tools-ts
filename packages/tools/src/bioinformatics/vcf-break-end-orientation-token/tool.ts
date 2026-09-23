import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly allele: string };
export type Output = {
  readonly remote: string;
  readonly bracket: string;
  readonly localSequence: string;
  readonly sequencePlacement: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allele: { type: "string", maxLength: 8192 } },
  required: ["allele"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remote: { type: "string", maxLength: 8192 },
    bracket: { type: "string", maxLength: 8192 },
    localSequence: { type: "string", maxLength: 8192 },
    sequencePlacement: { type: "string", maxLength: 8192 },
  },
  required: ["remote", "bracket", "localSequence", "sequencePlacement"],
} as const;
/** Parse the common ASCII-contig, ACGTN-sequence paired-breakend subset into literal bracket and sequence placement; no rearrangement inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allele } = request;
  const compute = (): Output => {
    const match =
      /^([ACGTNacgtn]*)([\[\]])([A-Za-z0-9_.-]+:[1-9]\d*)\2([ACGTNacgtn]*)(?![\s\S])/.exec(
        allele,
      );
    H.domain(match && match[1].length > 0 !== match[4].length > 0, "allele");
    return {
      remote: match[3],
      bracket: match[2],
      localSequence: match[1] || match[4],
      sequencePlacement: match[1] ? "before-remote" : "after-remote",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allele: "A]chr1:10]" },
  output: {
    remote: "chr1:10",
    bracket: "]",
    localSequence: "A",
    sequencePlacement: "before-remote",
  },
} satisfies ToolExample<Input, Output>;
export const vcfBreakEndOrientationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/vcf-break-end-orientation-token",
    title: "VCF Break End Orientation Token Tool",
    description:
      "Parse the common ASCII-contig, ACGTN-sequence paired-breakend subset into literal bracket and sequence placement; no rearrangement inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allele: { type: "string", maxLength: 8192 } },
      required: ["allele"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remote: { type: "string", maxLength: 8192 },
        bracket: { type: "string", maxLength: 8192 },
        localSequence: { type: "string", maxLength: 8192 },
        sequencePlacement: { type: "string", maxLength: 8192 },
      },
      required: ["remote", "bracket", "localSequence", "sequencePlacement"],
    },
    ports: {
      inputs: [
        {
          id: "allele",
          label: "Allele",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "remote", label: "Remote", valueType: { type: "string" } },
        { id: "bracket", label: "Bracket", valueType: { type: "string" } },
        {
          id: "localSequence",
          label: "Local Sequence",
          valueType: { type: "string" },
        },
        {
          id: "sequencePlacement",
          label: "Sequence Placement",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = vcfBreakEndOrientationTokenTool.execute;
export default vcfBreakEndOrientationTokenTool;
