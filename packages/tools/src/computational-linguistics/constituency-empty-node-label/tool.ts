import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emptyCategory: string;
  readonly coindex: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emptyCategory: { type: "string", maxLength: 8192, minLength: 1 },
    coindex: { type: "integer", minimum: 0 },
  },
  required: ["emptyCategory", "coindex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Append an explicit positive coindex to a supplied empty-category label using a label-index convention; zero denotes no coindex and no treebank inventory is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emptyCategory, coindex } = request;
  const compute = (): Output => {
    H.domain(
      emptyCategory.length > 0 && !/\s/.test(emptyCategory),
      "emptyCategory",
    );
    (H.domain(
      Number.isSafeInteger(coindex) &&
        coindex >= 0 &&
        coindex <= Number.MAX_SAFE_INTEGER,
      "coindex",
    ),
      coindex);
    return { label: emptyCategory + (coindex === 0 ? "" : "-" + coindex) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { emptyCategory: "*T*", coindex: 3 },
  output: { label: "*T*-3" },
} satisfies ToolExample<Input, Output>;
export const constituencyEmptyNodeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/constituency-empty-node-label",
    title: "Constituency Empty Node Label",
    description:
      "Append an explicit positive coindex to a supplied empty-category label using a label-index convention; zero denotes no coindex and no treebank inventory is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emptyCategory: { type: "string", maxLength: 8192, minLength: 1 },
        coindex: { type: "integer", minimum: 0 },
      },
      required: ["emptyCategory", "coindex"],
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
          id: "emptyCategory",
          label: "Empty Category",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "coindex",
          label: "Coindex",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = constituencyEmptyNodeLabelTool.execute;
export default constituencyEmptyNodeLabelTool;
