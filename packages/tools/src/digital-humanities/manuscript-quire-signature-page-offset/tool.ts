import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quire: number;
  readonly bifolia: number;
  readonly leafWithin: number;
  readonly verso: boolean;
  readonly firstPage: number;
};
export type Output = { readonly page: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quire: { type: "integer", minimum: 1 },
    bifolia: { type: "integer", minimum: 1 },
    leafWithin: { type: "integer", minimum: 1 },
    verso: { type: "boolean" },
    firstPage: { type: "integer", minimum: 0 },
  },
  required: ["quire", "bifolia", "leafWithin", "verso", "firstPage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { page: { type: "integer" } },
  required: ["page"],
} as const;
/** Regular complete quires of two leaves per bifolium and two sides per leaf; irregular gatherings need explicit alignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quire, bifolia, leafWithin, verso, firstPage } = request;
  const compute = (): Output => {
    H.integer(quire, 1);
    H.integer(bifolia, 1);
    H.integer(leafWithin, 1, 2 * bifolia);
    H.integer(firstPage, 0);
    return {
      page:
        firstPage +
        (quire - 1) * 4 * bifolia +
        2 * (leafWithin - 1) +
        (verso ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quire: 2, bifolia: 4, leafWithin: 3, verso: true, firstPage: 1 },
  output: { page: 22 },
} satisfies ToolExample<Input, Output>;
export const manuscriptQuireSignaturePageOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/manuscript-quire-signature-page-offset",
    title: "Manuscript Quire Signature Page Offset Tool",
    description:
      "Regular complete quires of two leaves per bifolium and two sides per leaf; irregular gatherings need explicit alignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quire: { type: "integer", minimum: 1 },
        bifolia: { type: "integer", minimum: 1 },
        leafWithin: { type: "integer", minimum: 1 },
        verso: { type: "boolean" },
        firstPage: { type: "integer", minimum: 0 },
      },
      required: ["quire", "bifolia", "leafWithin", "verso", "firstPage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { page: { type: "integer" } },
      required: ["page"],
    },
    ports: {
      inputs: [
        {
          id: "quire",
          label: "Quire",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bifolia",
          label: "Bifolia",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leafWithin",
          label: "Leaf Within",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "verso",
          label: "Verso",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "firstPage",
          label: "First Page",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "page", label: "Page", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = manuscriptQuireSignaturePageOffsetTool.execute;
export default manuscriptQuireSignaturePageOffsetTool;
