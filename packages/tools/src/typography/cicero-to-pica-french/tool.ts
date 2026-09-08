import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly traditionalFrenchCiceros: number }>;
export type Output = Readonly<{ readonly postscriptPicas: number }>;
const inputFields = [
  {
    id: "traditionalFrenchCiceros",
    label: "Traditional french ciceros",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.traditionalFrenchCiceros, "traditionalFrenchCiceros");
  return {
    postscriptPicas: input.traditionalFrenchCiceros * 1.0657460137322836,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { traditionalFrenchCiceros: 2 } satisfies Input;
export const exampleOutput = {
  postscriptPicas: 2.1314920274645672,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/cicero-to-pica-french",
  title: "Cicero to Pica (French) Converter",
  description:
    "Dec lared traditional French Didot point .3759715104 mm, cicero 12 Didot points, Post Script pica 25.4/6 mm; other modern/historical cicero variants not inferred. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    { id: "postscriptPicas", label: "Postscript picas", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      traditionalFrenchCiceros: value.traditionalFrenchCiceros as number,
    }),
});
export const run = tool.execute;
export default tool;
