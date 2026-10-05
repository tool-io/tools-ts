import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly folioText: string;
  readonly side: string;
  readonly column: string;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folioText: { type: "string", maxLength: 8192 },
    side: { type: "string", maxLength: 8192, enum: ["r", "v"] },
    column: { type: "string", maxLength: 8192 },
  },
  required: ["folioText", "side", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format a manuscript folio, recto/verso and optional single-letter column reference under an explicit compact convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { folioText, side, column } = request;
  const compute = (): Output => {
    H.domain(/^[0-9]+[A-Za-z]?(?![\s\S])/.test(folioText), "folioText");
    H.domain(["r", "v"].includes(side), "side");
    H.domain(/^(?:[a-z]|)(?![\s\S])/.test(column), "column");
    return { reference: folioText + side + column };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folioText: "12", side: "v", column: "b" },
  output: { reference: "12vb" },
} satisfies ToolExample<Input, Output>;
export const manuscriptFolioSurfaceReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/manuscript-folio-surface-reference",
    title: "Manuscript Folio Surface Reference Tool",
    description:
      "Format a manuscript folio, recto/verso and optional single-letter column reference under an explicit compact convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folioText: { type: "string", maxLength: 8192 },
        side: { type: "string", maxLength: 8192, enum: ["r", "v"] },
        column: { type: "string", maxLength: 8192 },
      },
      required: ["folioText", "side", "column"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    ports: {
      inputs: [
        {
          id: "folioText",
          label: "Folio Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptFolioSurfaceReferenceTool.execute;
export default manuscriptFolioSurfaceReferenceTool;
