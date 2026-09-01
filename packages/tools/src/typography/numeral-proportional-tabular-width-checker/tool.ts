import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly observedNumeralAdvances: readonly number[];
  readonly callerEqualWidthTolerance: number;
}>;
export type Output = Readonly<{
  readonly observedAdvanceSpread: number;
  readonly withinCallerTabularTolerance: boolean;
  readonly exactlyEqualAdvances: boolean;
}>;
const inputFields = [
  {
    id: "observedNumeralAdvances",
    label: "Observed numeral advances",
    kind: "numberList",
  },
  {
    id: "callerEqualWidthTolerance",
    label: "Caller equal width tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedNumeralAdvances.forEach((v) =>
    positive(v, "observedNumeralAdvances"),
  );
  nonnegative(input.callerEqualWidthTolerance, "callerEqualWidthTolerance");
  if (
    input.observedNumeralAdvances.length !== 10 &&
    input.observedNumeralAdvances.length !== 3
  )
    simpleError(
      "advances",
      "Provide all ten digits or explicit three-digit calibration sample.",
    );
  const spread =
    Math.max(...input.observedNumeralAdvances) -
    Math.min(...input.observedNumeralAdvances);
  return {
    observedAdvanceSpread: spread,
    withinCallerTabularTolerance: spread <= input.callerEqualWidthTolerance,
    exactlyEqualAdvances: spread === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNumeralAdvances: [500, 500, 501],
  callerEqualWidthTolerance: 1,
} satisfies Input;
export const exampleOutput = {
  observedAdvanceSpread: 1,
  withinCallerTabularTolerance: true,
  exactlyEqualAdvances: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/numeral-proportional-tabular-width-checker",
  title: "Proportional vs Tabular Numeral Width Check",
  description:
    "Audit caller measured numeral advances for exact or tolerance-based tabularity; observation coverage must be known and equality does not prove activated font feature.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAdvanceSpread",
      label: "Observed advance spread",
      kind: "number",
    },
    {
      id: "withinCallerTabularTolerance",
      label: "Within caller tabular tolerance",
      kind: "boolean",
    },
    {
      id: "exactlyEqualAdvances",
      label: "Exactly equal advances",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNumeralAdvances:
        value.observedNumeralAdvances as readonly number[],
      callerEqualWidthTolerance: value.callerEqualWidthTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
