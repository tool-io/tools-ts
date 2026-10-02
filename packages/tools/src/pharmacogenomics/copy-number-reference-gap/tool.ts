import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedCopyNumber: number;
  readonly referenceCopyNumber: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCopyNumber: { type: "number", minimum: 0 },
    referenceCopyNumber: { type: "number", minimum: 0 },
  },
  required: ["suppliedCopyNumber", "referenceCopyNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied nonclinical copy-number coordinates without inferring an allele or phenotype. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedCopyNumber, referenceCopyNumber } = request;
  const compute = (): Output => {
    H.domain(suppliedCopyNumber >= 0 && referenceCopyNumber >= 0);
    return { gap: suppliedCopyNumber - referenceCopyNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedCopyNumber: 3, referenceCopyNumber: 2 },
  output: { gap: 1 },
} satisfies ToolExample<Input, Output>;
export const copyNumberReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/copy-number-reference-gap",
    title: "Copy Number Reference Gap Tool",
    description:
      "Compare supplied nonclinical copy-number coordinates without inferring an allele or phenotype.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedCopyNumber: { type: "number", minimum: 0 },
        referenceCopyNumber: { type: "number", minimum: 0 },
      },
      required: ["suppliedCopyNumber", "referenceCopyNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedCopyNumber",
          label: "Supplied Copy Number",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCopyNumber",
          label: "Reference Copy Number",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = copyNumberReferenceGapTool.execute;
export default copyNumberReferenceGapTool;
