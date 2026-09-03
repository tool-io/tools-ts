import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  transpose,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly columns: number;
  readonly decode: boolean;
}>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "decode", label: "Decode", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.columns, "columns", 1, 128);
  return {
    transformed: transpose(
      input.text,
      input.columns,
      Array.from({ length: input.columns }, (_, i) => i),
      input.decode,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABCDE",
  columns: 2,
  decode: false,
} satisfies Input;
export const exampleOutput = { transformed: "ACEBD" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/scytale-transposition",
  title: "Scytale Transposition Tool",
  description:
    "Ragged unpadded scytale natural column transposition, row-major input, no fabricated cells. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      columns: value.columns as number,
      decode: value.decode as boolean,
    }),
});
export const run = tool.execute;
export default tool;
