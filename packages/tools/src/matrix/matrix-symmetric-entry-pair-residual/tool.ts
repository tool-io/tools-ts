import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly entryIJ: number; readonly entryJI: number };
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entryIJ: { type: "number" }, entryJI: { type: "number" } },
  required: ["entryIJ", "entryJI"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicitly supplied transposed matrix entries without asserting whole-matrix symmetry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryIJ, entryJI } = request;
  const compute = (): Output => {
    return { signedGap: entryJI - entryIJ };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryIJ: 12, entryJI: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const matrixSymmetricEntryPairResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["matrix", "mathematics"],
      keywords: ["matrix", "mathematics"],
    },
    id: "matrix/matrix-symmetric-entry-pair-residual",
    title: "Matrix Symmetric Entry Pair Residual",
    description:
      "Subtract explicitly supplied transposed matrix entries without asserting whole-matrix symmetry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { entryIJ: { type: "number" }, entryJI: { type: "number" } },
      required: ["entryIJ", "entryJI"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "entryIJ",
          label: "Entry IJ",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "entryJI",
          label: "Entry JI",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = matrixSymmetricEntryPairResidualTool.execute;
export default matrixSymmetricEntryPairResidualTool;
