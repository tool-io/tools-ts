import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly label: string };
export type Output = {
  readonly kind: string;
  readonly number: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    number: { type: "integer" },
    total: { type: "integer" },
  },
  required: ["kind", "number", "total"],
} as const;
/** Recognize exact AP, HC and positive n/total label forms without authenticating an edition; unnumbered proof counts use zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label } = request;
  const compute = (): Output => {
    if (label === "AP" || label === "HC")
      return { kind: label, number: 0, total: 0 };
    const match = /^([1-9][0-9]*)\/([1-9][0-9]*)(?![\s\S])/.exec(label);
    H.domain(match !== null);
    const number = Number(match[1]),
      total = Number(match[2]);
    H.integer(total, 1);
    H.integer(number, 1, total);
    return { kind: "numbered", number, total };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "3/50" },
  output: { kind: "numbered", number: 3, total: 50 },
} satisfies ToolExample<Input, Output>;
export const editionProofNumberedUnnumberedTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/edition-proof-numbered-unnumbered-tag",
    title: "Edition Proof Numbered Unnumbered Tag Tool",
    description:
      "Recognize exact AP, HC and positive n/total label forms without authenticating an edition; unnumbered proof counts use zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", maxLength: 8192 },
        number: { type: "integer" },
        total: { type: "integer" },
      },
      required: ["kind", "number", "total"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "kind", label: "Kind", valueType: { type: "string" } },
        { id: "number", label: "Number", valueType: { type: "integer" } },
        { id: "total", label: "Total", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = editionProofNumberedUnnumberedTagTool.execute;
export default editionProofNumberedUnnumberedTagTool;
