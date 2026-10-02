import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly kind: string; readonly index: number };
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
    kind: { type: "string", maxLength: 8192 },
    index: { type: "integer" },
  },
  required: ["kind", "index"],
} as const;
/** Parse an explicit exon/intron ordinal token without genomic boundary inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^(exon|intron):([1-9]\d*)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const index = Number(match[2]);
    H.integer(index, 1);
    return { kind: match[1], index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "exon:3" },
  output: { kind: "exon", index: 3 },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneExonIntronBoundaryTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogene-exon-intron-boundary-token",
      title: "Pharmacogene Exon Intron Boundary Token Tool",
      description:
        "Parse an explicit exon/intron ordinal token without genomic boundary inference.",
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
          kind: { type: "string", maxLength: 8192 },
          index: { type: "integer" },
        },
        required: ["kind", "index"],
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
          { id: "kind", label: "Kind", valueType: { type: "string" } },
          { id: "index", label: "Index", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogeneExonIntronBoundaryTokenTool.execute;
export default pharmacogeneExonIntronBoundaryTokenTool;
