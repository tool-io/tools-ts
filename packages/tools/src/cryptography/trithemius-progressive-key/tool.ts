import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  letters,
  mod,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly initialShift: number;
  readonly progressionStep: number;
  readonly decode: boolean;
}>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "initialShift", label: "Initial shift", kind: "number" },
  { id: "progressionStep", label: "Progression step", kind: "number" },
  { id: "decode", label: "Decode", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.text);
  bounded(input.initialShift, "shift", 0, 25);
  bounded(input.progressionStep, "step", 0, 25);
  return {
    transformed: [...input.text]
      .map((c, i) =>
        String.fromCharCode(
          65 +
            mod(
              c.charCodeAt(0) -
                65 +
                (input.decode ? -1 : 1) *
                  (input.initialShift + i * input.progressionStep),
            ),
        ),
      )
      .join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "AAAA",
  initialShift: 0,
  progressionStep: 1,
  decode: false,
} satisfies Input;
export const exampleOutput = { transformed: "ABCD" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/trithemius-progressive-key",
  title: "Trithemius Progressive Key Cipher",
  description:
    "Explicit Trithemius arithmetic progression per ASCII letter, bounded modular shift/step and decode. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      initialShift: value.initialShift as number,
      progressionStep: value.progressionStep as number,
      decode: value.decode as boolean,
    }),
});
export const run = tool.execute;
export default tool;
