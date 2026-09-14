import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly minTileX: number;
  readonly maxTileX: number;
  readonly minTileY: number;
  readonly maxTileY: number;
  readonly zoom: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "minTileX", label: "Min tile x", kind: "number" },
  { id: "maxTileX", label: "Max tile x", kind: "number" },
  { id: "minTileY", label: "Min tile y", kind: "number" },
  { id: "maxTileY", label: "Max tile y", kind: "number" },
  { id: "zoom", label: "Zoom", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.zoom, "zoom", 0, 26);
  const n = 2 ** i.zoom;
  [i.minTileX, i.maxTileX, i.minTileY, i.maxTileY].forEach((v) =>
    bounded(v, "tile", 0, n - 1),
  );
  range([i.minTileX, i.maxTileX], "x");
  range([i.minTileY, i.maxTileY], "y");
  return {
    tileCount: (i.maxTileX - i.minTileX + 1) * (i.maxTileY - i.minTileY + 1),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { minTileX: 0, maxTileX: 1, minTileY: 1, maxTileY: 2, zoom: 2 },
  output: { result: { tileCount: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/tile-count-extent-zoom-calculator",
  title: "Tile Count to Cover Extent at Zoom Calculator",
  description:
    "Count inclusive caller established XYZ tile bounds at zoom; does not derive bounds from lon/lat or handle wrapped extents.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
