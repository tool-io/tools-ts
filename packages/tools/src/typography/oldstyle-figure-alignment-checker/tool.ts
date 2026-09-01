import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, shape } from "../shared.js";
export type Input = Readonly<{
  readonly numeralGlyphYBounds: readonly (readonly number[])[];
  readonly callerBaselineTolerance: number;
  readonly callerTopTolerance: number;
}>;
export type Output = Readonly<{
  readonly descendingNumeralIndices: readonly number[];
  readonly aboveLowerMedianNumeralTopIndices: readonly number[];
  readonly lowerMedianObservedNumeralTop: number;
  readonly mixedVerticalAlignmentObserved: boolean;
}>;
const inputFields = [
  {
    id: "numeralGlyphYBounds",
    label: "Numeral glyph y bounds",
    kind: "matrix",
  },
  {
    id: "callerBaselineTolerance",
    label: "Caller baseline tolerance",
    kind: "number",
  },
  { id: "callerTopTolerance", label: "Caller top tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerBaselineTolerance, "callerBaselineTolerance");
  nonnegative(input.callerTopTolerance, "callerTopTolerance");
  if (
    shape(input.numeralGlyphYBounds, "bounds") !== 2 ||
    input.numeralGlyphYBounds.some((r) => r[1] < r[0])
  )
    simpleError("bounds", "Ordered min/max Y pairs required.");
  const tops = input.numeralGlyphYBounds.map((r) => r[1]).sort((a, b) => a - b),
    reference = tops[Math.floor((tops.length - 1) / 2)],
    down = input.numeralGlyphYBounds.flatMap((r, i) =>
      r[0] < -input.callerBaselineTolerance ? [i] : [],
    ),
    up = input.numeralGlyphYBounds.flatMap((r, i) =>
      r[1] > reference + input.callerTopTolerance ? [i] : [],
    );
  return {
    descendingNumeralIndices: down,
    aboveLowerMedianNumeralTopIndices: up,
    lowerMedianObservedNumeralTop: reference,
    mixedVerticalAlignmentObserved: down.length > 0 || up.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  numeralGlyphYBounds: [
    [-2, 7],
    [0, 10],
    [-2, 7],
    [0, 7],
  ],
  callerBaselineTolerance: 0,
  callerTopTolerance: 0,
} satisfies Input;
export const exampleOutput = {
  descendingNumeralIndices: [0, 2],
  aboveLowerMedianNumeralTopIndices: [1],
  lowerMedianObservedNumeralTop: 7,
  mixedVerticalAlignmentObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/oldstyle-figure-alignment-checker",
  title: "Oldstyle Figure Alignment Checker",
  description:
    "Audit supplied numeral outlines for descenders and departures from lower observed median top; observed mixed alignment is not proof a font feature is oldstyle or correctly selected.",
  inputs: inputFields,
  outputs: [
    {
      id: "descendingNumeralIndices",
      label: "Descending numeral indices",
      kind: "numberList",
    },
    {
      id: "aboveLowerMedianNumeralTopIndices",
      label: "Above lower median numeral top indices",
      kind: "numberList",
    },
    {
      id: "lowerMedianObservedNumeralTop",
      label: "Lower median observed numeral top",
      kind: "number",
    },
    {
      id: "mixedVerticalAlignmentObserved",
      label: "Mixed vertical alignment observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      numeralGlyphYBounds:
        value.numeralGlyphYBounds as readonly (readonly number[])[],
      callerBaselineTolerance: value.callerBaselineTolerance as number,
      callerTopTolerance: value.callerTopTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
