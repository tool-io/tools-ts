import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, pitch, namePitch } from "../shared.js";
export type Input = Readonly<{ readonly scientificNote: string }>;
export type Output = Readonly<{ readonly helmholtzNote: string }>;
const inputFields = [
  { id: "scientificNote", label: "Scientific note", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = pitch(input.scientificNote, true),
    o = p.octave!;
  if (o < 0 || o > 8)
    simpleError("octave", "Helmholtz display supports written octaves 0–8.");
  const base = namePitch({ ...p, octave: null });
  return {
    helmholtzNote:
      (o >= 3 ? base[0].toLowerCase() + base.slice(1) : base) +
      (o >= 3 ? "'".repeat(o - 3) : ",".repeat(2 - o)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { scientificNote: "C4" } satisfies Input;
export const exampleOutput = { helmholtzNote: "c'" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/spn-to-helmholtz-converter",
  title: "SPN to Helmholtz Notation Converter",
  description:
    "Convert exact SPN to explicitly defined Helmholtz case/comma/apostrophe convention (C2=C, C3=c, C4=c′), retaining accidentals; not an octave-only alias.",
  inputs: inputFields,
  outputs: [{ id: "helmholtzNote", label: "Helmholtz note", kind: "string" }],
  calculate: (value) =>
    calculate({ scientificNote: value.scientificNote as string }),
});
export const run = tool.execute;
export default tool;
