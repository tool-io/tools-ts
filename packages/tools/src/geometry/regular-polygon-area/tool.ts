import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const regularPolygonAreaExample = {
  input: { sideLength: 4, sides: 6 },
  output: { area: 41.569219381653056 },
} satisfies ToolExample<RegularPolygonAreaInput, RegularPolygonAreaOutput>;

export type RegularPolygonAreaInput = {
  readonly sideLength: number;
  readonly sides: number;
};
export type RegularPolygonAreaOutput = { readonly area: number };

export const calculateRegularPolygonArea = (
  input: RegularPolygonAreaInput,
): RegularPolygonAreaOutput => {
  const n = input.sides;
  if (n < 3)
    simpleError(
      "sides",
      "A polygon must have at least three sides.",
      "invalid_sides",
    );
  return {
    area: (n * input.sideLength ** 2) / (4 * Math.tan(Math.PI / n)),
  };
};

export const regularPolygonAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateRegularPolygonArea(input as unknown as RegularPolygonAreaInput),
  description:
    "Compute the area of a regular polygon from its side length and number of sides.",
  id: "geometry/regular-polygon-area",
  inputs: [
    { id: "sideLength", kind: "number", label: "Side length", minimum: 0 },
    {
      id: "sides",
      kind: "integer",
      label: "Number of sides",
      maximum: 100,
      minimum: 3,
    },
  ],
  outputs: [{ id: "area", kind: "number", label: "Area" }],
  title: "Regular Polygon Area Calculator",
});
export const runRegularPolygonArea = regularPolygonAreaTool.execute;
export default regularPolygonAreaTool;
