import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const regularHexagonPerimeterTool = createSimpleTool({
  id: "geometry/regular-hexagon-perimeter",
  title: "Regular Hexagon Perimeter Calculator",
  description:
    "Calculate the perimeter of a regular hexagon as six times its side length.",
  inputs: [
    {
      description: "Side length of the hexagon.",
      id: "side",
      label: "Side",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "perimeter", label: "Perimeter", kind: "number" }],
  calculate: (input) => {
    return { perimeter: 6 * (input.side as number) };
  },
});
export const runRegularHexagonPerimeter = regularHexagonPerimeterTool.execute;
export default regularHexagonPerimeterTool;

export type RegularHexagonPerimeterInput = {
  readonly side: number;
};

export type RegularHexagonPerimeterOutput = {
  readonly perimeter: number;
};

export const regularHexagonPerimeterExample = {
  input: {
    side: 1,
  },
  output: {
    perimeter: 6,
  },
} satisfies ToolExample<
  RegularHexagonPerimeterInput,
  RegularHexagonPerimeterOutput
>;
