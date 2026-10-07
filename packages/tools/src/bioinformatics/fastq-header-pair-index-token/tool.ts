import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly readId: string;
  readonly suppliedPairIndex: string;
  readonly sourceFormat: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPairIndex: { type: "string", maxLength: 8192, minLength: 1 },
    sourceFormat: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["readId", "suppliedPairIndex", "sourceFormat"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied FASTQ read pair index and source format without inferring a header dialect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { readId, suppliedPairIndex, sourceFormat } = request;
  const compute = (): Output => {
    H.domain(readId.length > 0, "readId");
    H.domain(suppliedPairIndex.length > 0, "suppliedPairIndex");
    H.domain(sourceFormat.length > 0, "sourceFormat");
    return { token: JSON.stringify([readId, suppliedPairIndex, sourceFormat]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    readId: "READ17",
    suppliedPairIndex: "1",
    sourceFormat: "instrument header",
  },
  output: { token: '["READ17","1","instrument header"]' },
} satisfies ToolExample<Input, Output>;
export const fastqHeaderPairIndexTokenTool = H.defineSchemaCalculation<
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
    id: "bioinformatics/fastq-header-pair-index-token",
    title: "FASTQ Header Pair Index Token",
    description:
      "Preserve an explicitly supplied FASTQ read pair index and source format without inferring a header dialect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPairIndex: { type: "string", maxLength: 8192, minLength: 1 },
        sourceFormat: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["readId", "suppliedPairIndex", "sourceFormat"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "readId",
          label: "Read Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPairIndex",
          label: "Supplied Pair Index",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceFormat",
          label: "Source Format",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fastqHeaderPairIndexTokenTool.execute;
export default fastqHeaderPairIndexTokenTool;
