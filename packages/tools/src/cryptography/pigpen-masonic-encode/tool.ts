import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, letters } from "../batch36-shared.js";
export type Input = Readonly<{ readonly text: string }>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const codes = [
    "G1",
    "G2",
    "G3",
    "G4",
    "G5",
    "G6",
    "G7",
    "G8",
    "G9",
    "G1.",
    "G2.",
    "G3.",
    "G4.",
    "G5.",
    "G6.",
    "G7.",
    "G8.",
    "G9.",
    "X1",
    "X2",
    "X3",
    "X4",
    "X1.",
    "X2.",
    "X3.",
    "X4.",
  ];
  letters(input.text);
  return {
    transformed: [...input.text]
      .map((c) => codes[c.charCodeAt(0) - 65])
      .join(" "),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { text: "ABZ" } satisfies Input;
export const exampleOutput = { transformed: "G1 G2 X4." } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/pigpen-masonic-encode",
  title: "Pigpen Masonic Encoder",
  description:
    "Encode explicit pigpen canonical ASCII symbol IDs, undotted grid A–I, dotted J–R, undotted X S–V and dotted W–Z; not visual glyph/font inference. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) => calculate({ text: value.text as string }),
});
export const run = tool.execute;
export default tool;
