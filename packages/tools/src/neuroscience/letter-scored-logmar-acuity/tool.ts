import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly startingLogmar: number;
  readonly lettersCorrect: number;
  readonly lettersPresented: number;
  readonly logmarPerLetter: number;
}>;
export type Output = Readonly<{
  readonly letterScoredLogmar: number;
  readonly decimalAcuity: number;
}>;
const inputFields = [
  { id: "startingLogmar", label: "Starting logmar", kind: "number" },
  { id: "lettersCorrect", label: "Letters correct", kind: "integer" },
  { id: "lettersPresented", label: "Letters presented", kind: "integer" },
  { id: "logmarPerLetter", label: "Logmar per letter", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.lettersCorrect, "lettersCorrect");
  count(input.lettersPresented, "lettersPresented", 1);
  positive(input.logmarPerLetter, "logmarPerLetter");
  if (input.lettersCorrect > input.lettersPresented)
    simpleError(
      "lettersCorrect",
      "Correct letters cannot exceed presented letters.",
    );
  const letterScoredLogmar =
    input.startingLogmar - input.lettersCorrect * input.logmarPerLetter;
  return { letterScoredLogmar, decimalAcuity: 10 ** -letterScoredLogmar };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  startingLogmar: 1,
  lettersCorrect: 25,
  lettersPresented: 50,
  logmarPerLetter: 0.02,
} satisfies Input;
export const exampleOutput = {
  letterScoredLogmar: 0.5,
  decimalAcuity: 0.31622776601683794,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/letter-scored-logmar-acuity",
  title: "Visual Acuity logMAR",
  description:
    "Score acuity using a caller-specified starting score and per-letter increment, then convert to decimal acuity; the chart scoring convention must be supplied.",
  inputs: inputFields,
  outputs: [
    { id: "letterScoredLogmar", label: "Letter scored logmar", kind: "number" },
    { id: "decimalAcuity", label: "Decimal acuity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startingLogmar: value.startingLogmar as number,
      lettersCorrect: value.lettersCorrect as number,
      lettersPresented: value.lettersPresented as number,
      logmarPerLetter: value.logmarPerLetter as number,
    }),
});
export const run = tool.execute;
export default tool;
