import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, letters } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly rows: number;
  readonly columns: number;
  readonly decode: boolean;
}>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "decode", label: "Decode", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.text);
  bounded(input.rows, "rows", 1, 64);
  bounded(input.columns, "columns", 1, 64);
  if (input.text.length !== input.rows * input.columns)
    simpleError(
      "grid",
      "Exact filled rectangular grid required; no guessed padding.",
    );
  const route: number[] = [];
  let top = 0,
    bottom = input.rows - 1,
    left = 0,
    right = input.columns - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) route.push(top * input.columns + c);
    top++;
    for (let r = top; r <= bottom; r++) route.push(r * input.columns + right);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--)
        route.push(bottom * input.columns + c);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) route.push(r * input.columns + left);
      left++;
    }
  }
  if (!input.decode)
    return { transformed: route.map((i) => input.text[i]).join("") };
  const out = Array<string>(route.length);
  route.forEach((cell, i) => {
    out[cell] = input.text[i];
  });
  return { transformed: out.join("") };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABCDEFGHI",
  rows: 3,
  columns: 3,
  decode: false,
} satisfies Input;
export const exampleOutput = { transformed: "ABCFIHGDE" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/route-spiral-transposition",
  title: "Route Spiral Transposition Tool",
  description:
    "Clockwise top-left inward spiral read of exact row-major rectangle, explicit inverse. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      rows: value.rows as number,
      columns: value.columns as number,
      decode: value.decode as boolean,
    }),
});
export const run = tool.execute;
export default tool;
