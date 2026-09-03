import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch36-shared.js";
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
  if (input.text.length > 16384)
    simpleError("text", "Bounded canonical pigpen token stream required.");
  const tokens = input.text === "" ? [] : input.text.split(" ");
  if (tokens.some((t) => !codes.includes(t)))
    simpleError(
      "pigpen",
      "Exact G1–G9, dotted G1.–G9., X1–X4/dotted X1.–X4. tokens required.",
    );
  return {
    transformed: tokens
      .map((t) => String.fromCharCode(65 + codes.indexOf(t)))
      .join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { text: "G1 G2 X4." } satisfies Input;
export const exampleOutput = { transformed: "ABZ" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/pigpen-masonic-decode",
  title: "Pigpen Masonic Decoder",
  description:
    "Encode explicit pigpen canonical ASCII symbol IDs, undotted grid A–I, dotted J–R, undotted X S–V and dotted W–Z; not visual glyph/font inference. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) => calculate({ text: value.text as string }),
});
export const run = tool.execute;
export default tool;
