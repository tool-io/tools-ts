import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredWidth: number;
  readonly stripWidth: number;
  readonly overlapWidth: number;
  readonly strips: number;
};
export type Output = { readonly coveredWidth: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredWidth: { type: "number", minimum: 0 },
    stripWidth: { type: "number", exclusiveMinimum: 0 },
    overlapWidth: { type: "number", minimum: 0 },
    strips: { type: "integer", minimum: 0 },
  },
  required: ["requiredWidth", "stripWidth", "overlapWidth", "strips"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coveredWidth: { type: "number" }, margin: { type: "number" } },
  required: ["coveredWidth", "margin"],
} as const;
/** Nominal supplied strip coverage with constant adjacent overlap, without selecting wrapping requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredWidth, stripWidth, overlapWidth, strips } = request;
  const compute = (): Output => {
    H.integer(strips, 0);
    H.domain(
      requiredWidth >= 0 &&
        stripWidth > 0 &&
        overlapWidth >= 0 &&
        overlapWidth < stripWidth,
    );
    return {
      coveredWidth:
        strips === 0
          ? 0
          : stripWidth + (strips - 1) * (stripWidth - overlapWidth),
      margin:
        (strips === 0
          ? 0
          : stripWidth + (strips - 1) * (stripWidth - overlapWidth)) -
        requiredWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredWidth: 100, stripWidth: 40, overlapWidth: 10, strips: 3 },
  output: { coveredWidth: 100, margin: 0 },
} satisfies ToolExample<Input, Output>;
export const baleWrapLayerWidthRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/bale-wrap-layer-width-remainder",
    title: "Bale Wrap Layer Width Remainder Tool",
    description:
      "Nominal supplied strip coverage with constant adjacent overlap, without selecting wrapping requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredWidth: { type: "number", minimum: 0 },
        stripWidth: { type: "number", exclusiveMinimum: 0 },
        overlapWidth: { type: "number", minimum: 0 },
        strips: { type: "integer", minimum: 0 },
      },
      required: ["requiredWidth", "stripWidth", "overlapWidth", "strips"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredWidth: { type: "number" },
        margin: { type: "number" },
      },
      required: ["coveredWidth", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "requiredWidth",
          label: "Required Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stripWidth",
          label: "Strip Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapWidth",
          label: "Overlap Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strips",
          label: "Strips",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "coveredWidth",
          label: "Covered Width",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = baleWrapLayerWidthRemainderTool.execute;
export default baleWrapLayerWidthRemainderTool;
