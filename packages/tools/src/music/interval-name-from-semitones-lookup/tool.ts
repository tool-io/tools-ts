import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly semitones: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "semitones", label: "Semitones", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.semitones,
      {
        "0": "unison",
        "1": "minor second",
        "2": "major second",
        "3": "minor third",
        "4": "major third",
        "5": "perfect fourth",
        "6": "tritone",
        "7": "perfect fifth",
        "8": "minor sixth",
        "9": "major sixth",
        "10": "minor seventh",
        "11": "major seventh",
        "12": "octave",
      },
      "semitones",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { semitones: "7" },
  output: { result: { reference: "perfect fifth" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/interval-name-from-semitones-lookup",
  title: "Interval Name From Semitones Lookup",
  description:
    "Common equal-tempered simple interval names by semitone count; enharmonic spellings and compound intervals excluded.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
