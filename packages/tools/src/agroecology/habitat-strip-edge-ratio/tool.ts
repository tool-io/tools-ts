import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly width: number };
export type Output = {
  readonly perimeter: number;
  readonly edgePerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", exclusiveMinimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["length", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perimeter: { type: "number" },
    edgePerArea: { type: "number" },
  },
  required: ["perimeter", "edgePerArea"],
} as const;
/** Calculate habitat strip edge ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width } = request;
  const compute = (): Output => {
    H.positive(length);
    H.positive(width);
    return {
      perimeter: 2 * (length + width),
      edgePerArea: 2 * (1 / length + 1 / width),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, width: 2 },
  output: { perimeter: 24, edgePerArea: 1.2 },
} satisfies ToolExample<Input, Output>;
export const habitatStripEdgeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/habitat-strip-edge-ratio",
    title: "Habitat Strip Edge Ratio Tool",
    description:
      "Calculate habitat strip edge ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", exclusiveMinimum: 0 },
        width: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["length", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeter: { type: "number" },
        edgePerArea: { type: "number" },
      },
      required: ["perimeter", "edgePerArea"],
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
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "perimeter", label: "Perimeter", valueType: { type: "number" } },
        {
          id: "edgePerArea",
          label: "Edge Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habitatStripEdgeRatioTool.execute;
export default habitatStripEdgeRatioTool;
