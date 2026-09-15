import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly direction: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "direction", label: "Direction", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.direction,
      {
        east: "wood: blue-green",
        southeast: "wood: blue-green",
        south: "fire: red",
        northeast: "earth: yellow/brown",
        southwest: "earth: yellow/brown",
        west: "metal: white/gray",
        northwest: "metal: white/gray",
        north: "water: black/dark blue",
      },
      "direction",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { direction: "north" },
  output: { result: { reference: "water: black/dark blue" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/feng-shui-direction-color-lookup",
  title: "Feng Shui Direction Color Lookup",
  description:
    "Bounded illustrative later-heaven compass/wuxing associations; not a building, health or fortune prediction.",
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
