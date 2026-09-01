import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  pitch,
  namePitch,
  staffIndex,
} from "../shared.js";
export type Input = Readonly<{
  readonly principalScientificNote: string;
  readonly upperNeighborScientificNote: string;
  readonly lowerNeighborScientificNote: string;
  readonly ornamentType: string;
}>;
export type Output = Readonly<{
  readonly ornamentScientificSequence: readonly string[];
}>;
const inputFields = [
  {
    id: "principalScientificNote",
    label: "Principal scientific note",
    kind: "string",
  },
  {
    id: "upperNeighborScientificNote",
    label: "Upper neighbor scientific note",
    kind: "string",
  },
  {
    id: "lowerNeighborScientificNote",
    label: "Lower neighbor scientific note",
    kind: "string",
  },
  { id: "ornamentType", label: "Ornament type", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = pitch(input.principalScientificNote, true),
    u = pitch(input.upperNeighborScientificNote, true),
    l = pitch(input.lowerNeighborScientificNote, true);
  if (
    staffIndex(u) - staffIndex(p) !== 1 ||
    staffIndex(p) - staffIndex(l) !== 1 ||
    u.absolute <= p.absolute ||
    l.absolute >= p.absolute
  )
    simpleError(
      "neighbors",
      "Spelled immediate upper/lower sounding neighbors required.",
    );
  const sequences: Record<string, string[]> = {
    turn: [namePitch(u), namePitch(p), namePitch(l), namePitch(p)],
    "inverted-turn": [namePitch(l), namePitch(p), namePitch(u), namePitch(p)],
    "upper-mordent": [namePitch(p), namePitch(u), namePitch(p)],
    "lower-mordent": [namePitch(p), namePitch(l), namePitch(p)],
  };
  if (!Object.hasOwn(sequences, input.ornamentType))
    simpleError(
      "ornament",
      "Explicit turn/inverted-turn/upper-mordent/lower-mordent convention required.",
    );
  return { ornamentScientificSequence: sequences[input.ornamentType] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  principalScientificNote: "C4",
  upperNeighborScientificNote: "D4",
  lowerNeighborScientificNote: "B3",
  ornamentType: "turn",
} satisfies Input;
export const exampleOutput = {
  ornamentScientificSequence: ["D4", "C4", "B3", "C4"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/ornament-note-sequence-generator",
  title: "Turn/Mordent Ornament Sequence Generator",
  description:
    "Generate explicit turn/mordent written-note order from caller principal and actual chromatic neighbors, avoiding assumed key signature or historical mordent naming ambiguity; no timing or performance prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "ornamentScientificSequence",
      label: "Ornament scientific sequence",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      principalScientificNote: value.principalScientificNote as string,
      upperNeighborScientificNote: value.upperNeighborScientificNote as string,
      lowerNeighborScientificNote: value.lowerNeighborScientificNote as string,
      ornamentType: value.ornamentType as string,
    }),
});
export const run = tool.execute;
export default tool;
