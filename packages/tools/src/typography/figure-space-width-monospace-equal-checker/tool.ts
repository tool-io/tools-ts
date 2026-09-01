import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly figureSpaceAdvanceUnits: number;
  readonly numeralDigitAdvancesUnits: readonly number[];
  readonly callerWidthToleranceUnits: number;
}>;
export type Output = Readonly<{
  readonly signedSpaceMinusDigitWidthsUnits: readonly number[];
  readonly matchesAllMeasuredDigits: boolean;
}>;
const inputFields = [
  {
    id: "figureSpaceAdvanceUnits",
    label: "Figure space advance units",
    kind: "number",
  },
  {
    id: "numeralDigitAdvancesUnits",
    label: "Numeral digit advances units",
    kind: "numberList",
  },
  {
    id: "callerWidthToleranceUnits",
    label: "Caller width tolerance units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.figureSpaceAdvanceUnits, "figureSpaceAdvanceUnits");
  input.numeralDigitAdvancesUnits.forEach((v) =>
    nonnegative(v, "numeralDigitAdvancesUnits"),
  );
  nonnegative(input.callerWidthToleranceUnits, "callerWidthToleranceUnits");
  if (!input.numeralDigitAdvancesUnits.length)
    simpleError("digits", "Nonempty measured numeral advance ledger required.");
  const d = input.numeralDigitAdvancesUnits.map(
    (v) => input.figureSpaceAdvanceUnits - v,
  );
  return {
    signedSpaceMinusDigitWidthsUnits: d,
    matchesAllMeasuredDigits: d.every(
      (v) => Math.abs(v) <= input.callerWidthToleranceUnits,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  figureSpaceAdvanceUnits: 500,
  numeralDigitAdvancesUnits: [500, 500, 500],
  callerWidthToleranceUnits: 0,
} satisfies Input;
export const exampleOutput = {
  signedSpaceMinusDigitWidthsUnits: [0, 0, 0],
  matchesAllMeasuredDigits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/figure-space-width-monospace-equal-checker",
  title: "Figure Space Monospace Equal Width Check",
  description:
    "Audit figure-space glyph against each actual numeral advance, preserving digit-specific mismatch; not inferred from font being called monospace or its nominal em.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSpaceMinusDigitWidthsUnits",
      label: "Signed space minus digit widths units",
      kind: "numberList",
    },
    {
      id: "matchesAllMeasuredDigits",
      label: "Matches all measured digits",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      figureSpaceAdvanceUnits: value.figureSpaceAdvanceUnits as number,
      numeralDigitAdvancesUnits:
        value.numeralDigitAdvancesUnits as readonly number[],
      callerWidthToleranceUnits: value.callerWidthToleranceUnits as number,
    }),
});
export const run = tool.execute;
export default tool;
