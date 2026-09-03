import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  letters,
  alphabet,
  mod,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly direction: number;
  readonly callerKeyboardRows: readonly string[];
}>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "direction", label: "Direction", kind: "number" },
  {
    id: "callerKeyboardRows",
    label: "Caller keyboard rows",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.direction !== 1 && input.direction !== -1)
    simpleError(
      "direction",
      "Direction ±1 with explicit per-row wrap required.",
    );
  const all = input.callerKeyboardRows.join("");
  alphabet(all);
  input.callerKeyboardRows.forEach((r) => {
    if (!r.length) simpleError("rows", "Nonempty rows required.");
  });
  letters(input.text);
  return {
    transformed: [...input.text]
      .map((c) => {
        const row = input.callerKeyboardRows.find((r) => r.includes(c))!;
        return row[mod(row.indexOf(c) + input.direction, row.length)];
      })
      .join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "QAZ",
  direction: 1,
  callerKeyboardRows: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
} satisfies Input;
export const exampleOutput = { transformed: "WSX" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/keyboard-neighbor-shift-cipher",
  title: "Keyboard Neighbor Shift Cipher",
  description:
    "Shift each letter in caller complete26-key row layout with explicit wrap, no OS keyboard access or Unicode layout assumption. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      direction: value.direction as number,
      callerKeyboardRows: value.callerKeyboardRows as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
