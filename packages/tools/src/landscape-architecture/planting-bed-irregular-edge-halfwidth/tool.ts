import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly firstHalfWidth: number;
  readonly secondHalfWidth: number;
};
export type Output = { readonly approximateArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    firstHalfWidth: { type: "number", minimum: 0 },
    secondHalfWidth: { type: "number", minimum: 0 },
  },
  required: ["length", "firstHalfWidth", "secondHalfWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { approximateArea: { type: "number" } },
  required: ["approximateArea"],
} as const;
/** Trapezoidal strip estimate from half-widths measured to both sides at each endpoint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, firstHalfWidth, secondHalfWidth } = request;
  const compute = (): Output => {
    H.domain(length >= 0 && firstHalfWidth >= 0 && secondHalfWidth >= 0);
    return { approximateArea: length * (firstHalfWidth + secondHalfWidth) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, firstHalfWidth: 2, secondHalfWidth: 3 },
  output: { approximateArea: 50 },
} satisfies ToolExample<Input, Output>;
export const plantingBedIrregularEdgeHalfwidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planting-bed-irregular-edge-halfwidth",
    title: "Planting BED Irregular Edge Halfwidth Tool",
    description:
      "Trapezoidal strip estimate from half-widths measured to both sides at each endpoint.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        firstHalfWidth: { type: "number", minimum: 0 },
        secondHalfWidth: { type: "number", minimum: 0 },
      },
      required: ["length", "firstHalfWidth", "secondHalfWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { approximateArea: { type: "number" } },
      required: ["approximateArea"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstHalfWidth",
          label: "First Half Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHalfWidth",
          label: "Second Half Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "approximateArea",
          label: "Approximate Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantingBedIrregularEdgeHalfwidthTool.execute;
export default plantingBedIrregularEdgeHalfwidthTool;
