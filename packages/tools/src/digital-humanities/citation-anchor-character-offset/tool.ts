import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly anchorOffset: number;
  readonly quoteOffset: number;
};
export type Output = { readonly relativeOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchorOffset: { type: "integer", minimum: 0 },
    quoteOffset: { type: "integer", minimum: 0 },
  },
  required: ["anchorOffset", "quoteOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeOffset: { type: "integer" } },
  required: ["relativeOffset"],
} as const;
/** Calculate citation anchor character offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { anchorOffset, quoteOffset } = request;
  const compute = (): Output => {
    H.integer(anchorOffset, 0);
    H.integer(quoteOffset, 0);
    return { relativeOffset: quoteOffset - anchorOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { anchorOffset: 100, quoteOffset: 125 },
  output: { relativeOffset: 25 },
} satisfies ToolExample<Input, Output>;
export const citationAnchorCharacterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/citation-anchor-character-offset",
    title: "Citation Anchor Character Offset Tool",
    description:
      "Calculate citation anchor character offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorOffset: { type: "integer", minimum: 0 },
        quoteOffset: { type: "integer", minimum: 0 },
      },
      required: ["anchorOffset", "quoteOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeOffset: { type: "integer" } },
      required: ["relativeOffset"],
    },
    ports: {
      inputs: [
        {
          id: "anchorOffset",
          label: "Anchor Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quoteOffset",
          label: "Quote Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "relativeOffset",
          label: "Relative Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = citationAnchorCharacterOffsetTool.execute;
export default citationAnchorCharacterOffsetTool;
