import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly flag: number };
export type Output = {
  readonly reverseComplemented: boolean;
  readonly strandToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flag: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["flag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reverseComplemented: { type: "boolean" },
    strandToken: { type: "string", maxLength: 8192 },
  },
  required: ["reverseComplemented", "strandToken"],
} as const;
/** Read SAM flag bit 0x10 only; this does not infer biological transcript strand. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flag } = request;
  const compute = (): Output => {
    H.integer(flag, 0, 65535);
    return {
      reverseComplemented: (flag & 16) !== 0,
      strandToken: (flag & 16) !== 0 ? "-" : "+",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flag: 16 },
  output: { reverseComplemented: true, strandToken: "-" },
} satisfies ToolExample<Input, Output>;
export const bamFlagStrandTokenTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "bioinformatics/bam-flag-strand-token",
    title: "BAM Flag Strand Token Tool",
    description:
      "Read SAM flag bit 0x10 only; this does not infer biological transcript strand.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { flag: { type: "integer", minimum: 0, maximum: 65535 } },
      required: ["flag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reverseComplemented: { type: "boolean" },
        strandToken: { type: "string", maxLength: 8192 },
      },
      required: ["reverseComplemented", "strandToken"],
    },
    ports: {
      inputs: [
        {
          id: "flag",
          label: "Flag",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "reverseComplemented",
          label: "Reverse Complemented",
          valueType: { type: "boolean" },
        },
        {
          id: "strandToken",
          label: "Strand Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = bamFlagStrandTokenTool.execute;
export default bamFlagStrandTokenTool;
