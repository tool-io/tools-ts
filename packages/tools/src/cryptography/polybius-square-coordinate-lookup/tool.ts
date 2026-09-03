import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, letters, alphabet } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerSquare: string;
  readonly queryLetter: string;
}>;
export type Output = Readonly<{
  readonly rowOneBased: number;
  readonly columnOneBased: number;
}>;
const inputFields = [
  { id: "callerSquare", label: "Caller square", kind: "string" },
  { id: "queryLetter", label: "Query letter", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  alphabet(input.callerSquare, 25);
  letters(input.queryLetter, input.callerSquare);
  if (input.queryLetter.length !== 1)
    simpleError("query", "One explicit square letter required.");
  const i = input.callerSquare.indexOf(input.queryLetter);
  return { rowOneBased: Math.floor(i / 5) + 1, columnOneBased: (i % 5) + 1 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSquare: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
  queryLetter: "H",
} satisfies Input;
export const exampleOutput = {
  rowOneBased: 2,
  columnOneBased: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/polybius-square-coordinate-lookup",
  title: "Polybius Square Coordinate Lookup",
  description:
    "Lookup one caller-defined Polybius cell with one-based row/column, no automatic I/J merge. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [
    { id: "rowOneBased", label: "Row one based", kind: "number" },
    { id: "columnOneBased", label: "Column one based", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerSquare: value.callerSquare as string,
      queryLetter: value.queryLetter as string,
    }),
});
export const run = tool.execute;
export default tool;
