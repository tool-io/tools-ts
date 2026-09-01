import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pitch,
  staffIndex,
  clefBottom,
} from "../shared.js";
export type Input = Readonly<{
  readonly scientificNote: string;
  readonly clef: string;
}>;
export type Output = Readonly<{
  readonly staffStepFromBottomLine: number;
  readonly requiredLedgerLineCount: number;
  readonly outsideStaff: boolean;
}>;
const inputFields = [
  { id: "scientificNote", label: "Scientific note", kind: "string" },
  { id: "clef", label: "Clef", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const s =
      staffIndex(pitch(input.scientificNote, true)) - clefBottom(input.clef),
    d = s < 0 ? -s : s > 8 ? s - 8 : 0;
  return {
    staffStepFromBottomLine: s,
    requiredLedgerLineCount: Math.floor(d / 2),
    outsideStaff: d > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  scientificNote: "C4",
  clef: "treble",
} satisfies Input;
export const exampleOutput = {
  staffStepFromBottomLine: -2,
  requiredLedgerLineCount: 1,
  outsideStaff: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/ledger-line-count-for-pitch",
  title: "Ledger Line Count For Pitch",
  description:
    "Count ledger lines for written pitch/clef based on diatonic staff position, including spaces beyond staff requiring no new ledger line; accidentals do not alter staff height.",
  inputs: inputFields,
  outputs: [
    {
      id: "staffStepFromBottomLine",
      label: "Staff step from bottom line",
      kind: "number",
    },
    {
      id: "requiredLedgerLineCount",
      label: "Required ledger line count",
      kind: "number",
    },
    { id: "outsideStaff", label: "Outside staff", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      scientificNote: value.scientificNote as string,
      clef: value.clef as string,
    }),
});
export const run = tool.execute;
export default tool;
