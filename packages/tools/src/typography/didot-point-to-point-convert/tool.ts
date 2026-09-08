import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly traditionalDidotPoints: number }>;
export type Output = Readonly<{ readonly postscriptPoints: number }>;
const inputFields = [
  {
    id: "traditionalDidotPoints",
    label: "Traditional didot points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.traditionalDidotPoints, "traditionalDidotPoints");
  return {
    postscriptPoints: input.traditionalDidotPoints * 1.0657460137322834,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { traditionalDidotPoints: 2 } satisfies Input;
export const exampleOutput = {
  postscriptPoints: 2.131492027464567,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/didot-point-to-point-convert",
  title: "Didot Point to Point Converter",
  description:
    "Dec lared traditional French Didot point .3759715104 mmto Post Script 25.4/72 mm point, not assume both point names are equal. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    { id: "postscriptPoints", label: "Postscript points", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      traditionalDidotPoints: value.traditionalDidotPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
