import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, hexRgb } from "../batch52-shared.js";
export type Input = Readonly<{ readonly hexSrgb: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hexSrgb", label: "Hex srgb", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  const v = hexRgb(i.hexSrgb),
    names = [
      "black",
      "silver",
      "gray",
      "white",
      "maroon",
      "red",
      "purple",
      "fuchsia",
      "green",
      "lime",
      "olive",
      "yellow",
      "navy",
      "blue",
      "teal",
      "aqua",
    ],
    swatches = [
      "000000",
      "c0c0c0",
      "808080",
      "ffffff",
      "800000",
      "ff0000",
      "800080",
      "ff00ff",
      "008000",
      "00ff00",
      "808000",
      "ffff00",
      "000080",
      "0000ff",
      "008080",
      "00ffff",
    ],
    dist = swatches.map((h) =>
      sum(hexRgb("#" + h).map((x, j) => (x - v[j]) ** 2)),
    ),
    best = Math.min(...dist);
  return {
    nearestHtml4Names: names.filter((_, j) => dist[j] === best),
    squaredEncodedDistance: best,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { hexSrgb: "#FF0000" },
  output: { result: { nearestHtml4Names: ["red"], squaredEncodedDistance: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/hex-to-nearest-html-color-name",
  title: "HEX to Nearest HTML Color Name",
  description:
    "Nearest of sixteen HTML4 basic named colors by encoded 8-bit RGB squared distance; ties retained, not full CSS/X11 table or perceptual distance.",
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
