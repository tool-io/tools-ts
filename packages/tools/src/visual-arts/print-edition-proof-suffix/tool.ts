import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proofKind: string;
  readonly number: number;
  readonly total: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proofKind: {
      type: "string",
      maxLength: 8192,
      enum: ["AP", "EA", "PP", "HC"],
    },
    number: { type: "integer", minimum: 1 },
    total: { type: "integer", minimum: 1 },
  },
  required: ["proofKind", "number", "total"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicitly supplied numbered proof notation; this does not establish authenticity or edition size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proofKind, number, total } = request;
  const compute = (): Output => {
    H.domain(["AP", "EA", "PP", "HC"].includes(proofKind), "proofKind");
    (H.domain(
      Number.isSafeInteger(total) &&
        total >= 1 &&
        total <= Number.MAX_SAFE_INTEGER,
      "total",
    ),
      total);
    (H.domain(
      Number.isSafeInteger(number) && number >= 1 && number <= total,
      "number",
    ),
      number);
    return { label: proofKind + " " + number + "/" + total };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { proofKind: "AP", number: 2, total: 10 },
  output: { label: "AP 2/10" },
} satisfies ToolExample<Input, Output>;
export const printEditionProofSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/print-edition-proof-suffix",
    title: "Print Edition Proof Suffix Tool",
    description:
      "Format explicitly supplied numbered proof notation; this does not establish authenticity or edition size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proofKind: {
          type: "string",
          maxLength: 8192,
          enum: ["AP", "EA", "PP", "HC"],
        },
        number: { type: "integer", minimum: 1 },
        total: { type: "integer", minimum: 1 },
      },
      required: ["proofKind", "number", "total"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "proofKind",
          label: "Proof Kind",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "number",
          label: "Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = printEditionProofSuffixTool.execute;
export default printEditionProofSuffixTool;
