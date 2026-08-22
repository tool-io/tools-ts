import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const hexagonAreaTool = createSimpleTool({
  id: "geometry/hexagon-area",
  title: "Regular Hexagon Area Calculator",
  description:
    "Calculate the area of a regular hexagon from its side length as (3√3/2)·s².",
  inputs: [
    {
      description: "Side length of the hexagon.",
      id: "side",
      label: "Side",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "area", label: "Area", kind: "number" }],
  calculate: (input) => {
    const side = input.side as number;
    return { area: ((3 * Math.sqrt(3)) / 2) * side * side };
  },
});
export const runHexagonArea = hexagonAreaTool.execute;
export default hexagonAreaTool;

export type HexagonAreaInput = {
  readonly side: number;
};

export type HexagonAreaOutput = {
  readonly area: number;
};

export const hexagonAreaExample = {
  input: {
    side: 1,
  },
  output: {
    area: 2.598076211353316,
  },
} satisfies ToolExample<HexagonAreaInput, HexagonAreaOutput>;
