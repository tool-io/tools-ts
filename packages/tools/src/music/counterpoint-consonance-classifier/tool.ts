import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pitch,
  intervalQuality,
  staffIndex,
} from "../shared.js";
export type Input = Readonly<{
  readonly lowerScientificNote: string;
  readonly upperScientificNote: string;
  readonly lowerVoiceIsBass: boolean;
}>;
export type Output = Readonly<{
  readonly counterpointIntervalClass: string;
  readonly consonantUnderTwoVoiceConvention: boolean;
  readonly spelledSimpleIntervalNumber: number;
}>;
const inputFields = [
  { id: "lowerScientificNote", label: "Lower scientific note", kind: "string" },
  { id: "upperScientificNote", label: "Upper scientific note", kind: "string" },
  { id: "lowerVoiceIsBass", label: "Lower voice is bass", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const l = pitch(input.lowerScientificNote, true),
    u = pitch(input.upperScientificNote, true),
    q = intervalQuality(staffIndex(u) - staffIndex(l), u.absolute - l.absolute),
    simple = ((q.number - 1) % 7) + 1;
  const perfect = q.quality === "perfect" && [1, 5].includes(simple),
    imperfect =
      [3, 6].includes(simple) && ["major", "minor"].includes(q.quality),
    fourth = simple === 4 && q.quality === "perfect",
    label = perfect
      ? "perfect-consonance"
      : imperfect
        ? "imperfect-consonance"
        : fourth
          ? input.lowerVoiceIsBass
            ? "context-dependent-fourth-over-bass"
            : "context-dependent-upper-voice-fourth"
          : "dissonance";
  return {
    counterpointIntervalClass: label,
    consonantUnderTwoVoiceConvention: perfect || imperfect,
    spelledSimpleIntervalNumber: simple,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lowerScientificNote: "C4",
  upperScientificNote: "F4",
  lowerVoiceIsBass: true,
} satisfies Input;
export const exampleOutput = {
  counterpointIntervalClass: "context-dependent-fourth-over-bass",
  consonantUnderTwoVoiceConvention: false,
  spelledSimpleIntervalNumber: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/counterpoint-consonance-classifier",
  title: "Counterpoint Consonance Classifier",
  description:
    "Screen ascending spelled intervals under elementary two-voice consonance convention; fourth remains context-dependent with bass role explicit, not universal counterpoint legality or enharmonic interval collapse.",
  inputs: inputFields,
  outputs: [
    {
      id: "counterpointIntervalClass",
      label: "Counterpoint interval class",
      kind: "string",
    },
    {
      id: "consonantUnderTwoVoiceConvention",
      label: "Consonant under two voice convention",
      kind: "boolean",
    },
    {
      id: "spelledSimpleIntervalNumber",
      label: "Spelled simple interval number",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lowerScientificNote: value.lowerScientificNote as string,
      upperScientificNote: value.upperScientificNote as string,
      lowerVoiceIsBass: value.lowerVoiceIsBass as boolean,
    }),
});
export const run = tool.execute;
export default tool;
