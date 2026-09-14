import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly element: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "element", label: "Element", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.element,
      {
        wood: "qing (blue-green)",
        fire: "red",
        earth: "yellow",
        metal: "white",
        water: "black",
      },
      "element",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { element: "wood" },
  output: { result: { reference: "qing (blue-green)" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/five-elements-traditional-color-lookup",
  title: "Five Elements Traditional Color Lookup",
  description:
    "Bounded common Chinese wuxing color associations; qing is not one modern standardized RGB color.",
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
