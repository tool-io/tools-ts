import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leaf: number;
  readonly referenceLeaf: number;
  readonly recto: boolean;
};
export type Output = { readonly halfLeafOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leaf: { type: "integer", minimum: 1 },
    referenceLeaf: { type: "integer", minimum: 1 },
    recto: { type: "boolean" },
  },
  required: ["leaf", "referenceLeaf", "recto"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { halfLeafOffset: { type: "number" } },
  required: ["halfLeafOffset"],
} as const;
/** Map supplied folio/side data to a half-leaf coordinate relative to the reference recto. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leaf, referenceLeaf, recto } = request;
  const compute = (): Output => {
    H.integer(leaf, 1);
    H.integer(referenceLeaf, 1);
    return { halfLeafOffset: leaf - referenceLeaf + (recto ? 0 : 0.5) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leaf: 12, referenceLeaf: 10, recto: false },
  output: { halfLeafOffset: 2.5 },
} satisfies ToolExample<Input, Output>;
export const publicManuscriptLeafOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/public-manuscript-leaf-offset",
    title: "Public Manuscript Leaf Offset Tool",
    description:
      "Map supplied folio/side data to a half-leaf coordinate relative to the reference recto.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leaf: { type: "integer", minimum: 1 },
        referenceLeaf: { type: "integer", minimum: 1 },
        recto: { type: "boolean" },
      },
      required: ["leaf", "referenceLeaf", "recto"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { halfLeafOffset: { type: "number" } },
      required: ["halfLeafOffset"],
    },
    ports: {
      inputs: [
        {
          id: "leaf",
          label: "Leaf",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceLeaf",
          label: "Reference Leaf",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recto",
          label: "Recto",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "halfLeafOffset",
          label: "Half Leaf Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicManuscriptLeafOffsetTool.execute;
export default publicManuscriptLeafOffsetTool;
