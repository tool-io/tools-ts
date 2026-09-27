import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly side: number;
  readonly stripWidth: number;
  readonly wasteArea: number;
};
export type Output = { readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "number", exclusiveMinimum: 0 },
    stripWidth: { type: "number", exclusiveMinimum: 0 },
    wasteArea: { type: "number", minimum: 0 },
  },
  required: ["side", "stripWidth", "wasteArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "number" } },
  required: ["length"],
} as const;
/** Calculate ideal continuous strip length by area conservation, with caller-supplied waste already deducted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { side, stripWidth, wasteArea } = request;
  const compute = (): Output => {
    H.positive(side);
    H.positive(stripWidth);
    H.domain(wasteArea >= 0 && wasteArea <= side * side);
    return { length: (side * side - wasteArea) / stripWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { side: 100, stripWidth: 5, wasteArea: 100 },
  output: { length: 1980 },
} satisfies ToolExample<Input, Output>;
export const biasStripLengthFromSquareAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/bias-strip-length-from-square-area",
    title: "Bias Strip Length From Square Area Tool",
    description:
      "Calculate ideal continuous strip length by area conservation, with caller-supplied waste already deducted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        side: { type: "number", exclusiveMinimum: 0 },
        stripWidth: { type: "number", exclusiveMinimum: 0 },
        wasteArea: { type: "number", minimum: 0 },
      },
      required: ["side", "stripWidth", "wasteArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "number" } },
      required: ["length"],
    },
    ports: {
      inputs: [
        {
          id: "side",
          label: "Side",
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
          id: "wasteArea",
          label: "Waste Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biasStripLengthFromSquareAreaTool.execute;
export default biasStripLengthFromSquareAreaTool;
