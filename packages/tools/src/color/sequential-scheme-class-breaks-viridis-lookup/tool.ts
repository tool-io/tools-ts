import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObservedValueMinimum: number;
  readonly callerObservedValueMaximum: number;
  readonly callerClassCount: number;
}>;
export type Output = Readonly<{
  readonly equalIntervalClassLowerBounds: readonly number[];
  readonly equalIntervalClassUpperBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedValueMinimum",
    label: "Caller observed value minimum",
    kind: "number",
  },
  {
    id: "callerObservedValueMaximum",
    label: "Caller observed value maximum",
    kind: "number",
  },
  { id: "callerClassCount", label: "Caller class count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerObservedValueMaximum <= input.callerObservedValueMinimum)
    simpleError("range", "Positive observed data range.");
  bounded(input.callerClassCount, "classes", 1, 128);
  const d =
    (input.callerObservedValueMaximum - input.callerObservedValueMinimum) /
    input.callerClassCount;
  return {
    equalIntervalClassLowerBounds: Array.from(
      { length: input.callerClassCount },
      (_, i) => input.callerObservedValueMinimum + i * d,
    ),
    equalIntervalClassUpperBounds: Array.from(
      { length: input.callerClassCount },
      (_, i) => input.callerObservedValueMinimum + (i + 1) * d,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedValueMinimum: 0,
  callerObservedValueMaximum: 100,
  callerClassCount: 4,
} satisfies Input;
export const exampleOutput = {
  equalIntervalClassLowerBounds: [0, 25, 50, 75],
  equalIntervalClassUpperBounds: [25, 50, 75, 100],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/sequential-scheme-class-breaks-viridis-lookup",
  title: "Sequential Viridis Class Breaks Lookup",
  description:
    "Generate explicit equal-interval scalar class breaks for caller sequential Viridis application, no color interpolation, quantiles or claim Viridis specifies universal class boundaries. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "equalIntervalClassLowerBounds",
      label: "Equal interval class lower bounds",
      kind: "numberList",
    },
    {
      id: "equalIntervalClassUpperBounds",
      label: "Equal interval class upper bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedValueMinimum: value.callerObservedValueMinimum as number,
      callerObservedValueMaximum: value.callerObservedValueMaximum as number,
      callerClassCount: value.callerClassCount as number,
    }),
});
export const run = tool.execute;
export default tool;
