import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{ readonly square: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "square", label: "Square", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (!/^[a-h][1-8]$(?![\s\S])/.test(i.square))
    simpleError("square", "Algebraic a1–h8.");
  return {
    squareColor:
      (i.square.charCodeAt(0) - 97 + Number(i.square[1]) - 1) % 2 === 0
        ? "dark"
        : "light",
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { square: "a1" },
  output: { result: { squareColor: "dark" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-algebraic-square-color-checker",
  title: "Algebraic Square Color Checker",
  description:
    "Conventional chessboard square color, a1 dark; no piece placement or position legality.",
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
