import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly spacing: number;
  readonly origin: number;
  readonly staggerFraction: number;
};
export type Output = { readonly coordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    spacing: { type: "number", exclusiveMinimum: 0 },
    origin: { type: "number" },
    staggerFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["index", "spacing", "origin", "staggerFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" } },
  required: ["coordinate"],
} as const;
/** One supplied stagger fraction along a Yee-grid axis; component-specific staggering is chosen by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, spacing, origin, staggerFraction } = request;
  const compute = (): Output => {
    H.positive(spacing);
    H.probability(staggerFraction);
    return { coordinate: origin + (index + staggerFraction) * spacing };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 3, spacing: 2, origin: 1, staggerFraction: 0.5 },
  output: { coordinate: 8 },
} satisfies ToolExample<Input, Output>;
export const yeeGridStaggeredCoordinateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/yee-grid-staggered-coordinate-offset",
    title: "Yee Grid Staggered Coordinate Offset Tool",
    description:
      "One supplied stagger fraction along a Yee-grid axis; component-specific staggering is chosen by the caller.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        spacing: { type: "number", exclusiveMinimum: 0 },
        origin: { type: "number" },
        staggerFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["index", "spacing", "origin", "staggerFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coordinate: { type: "number" } },
      required: ["coordinate"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "staggerFraction",
          label: "Stagger Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = yeeGridStaggeredCoordinateOffsetTool.execute;
export default yeeGridStaggeredCoordinateOffsetTool;
