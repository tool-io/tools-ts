import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  rad,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly zoom: number;
  readonly latitudeDegrees: number;
  readonly tilePixels: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "zoom", label: "Zoom", kind: "number" },
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
  { id: "tilePixels", label: "Tile pixels", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.zoom, "zoom", 0, 30);
  bounded(i.tilePixels, "pixels", 1, 8192);
  angle(i.latitudeDegrees, "latitude", -85.0511287798066, 85.0511287798066);
  return {
    approximateGroundMetersPerPixel:
      (2 * Math.PI * 6378137 * Math.cos(rad(i.latitudeDegrees))) /
      (i.tilePixels * 2 ** i.zoom),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { zoom: 0, latitudeDegrees: 0, tilePixels: 256 },
  output: { result: { approximateGroundMetersPerPixel: 156543.03392804097 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/tile-zoom-resolution-lookup",
  title: "Tile Zoom Level Resolution Approximation Lookup",
  description:
    "Web Mercator nominal local ground resolution using radius 6378137m, caller tile pixel width; latitude limited to Mercator range.",
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
