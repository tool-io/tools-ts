import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly noaelMgPerKgDay: number;
  readonly uncertaintyFactors: readonly number[];
  readonly durationAdjustmentFraction: number;
}>;
export type Output = Readonly<{
  readonly compositeUncertaintyFactor: number;
  readonly adjustedPointOfDepartureMgPerKgDay: number;
  readonly derivedReferenceDoseMgPerKgDay: number;
}>;
const inputFields = [
  { id: "noaelMgPerKgDay", label: "Noael mg per kg day", kind: "number" },
  {
    id: "uncertaintyFactors",
    label: "Uncertainty factors",
    kind: "numberList",
  },
  {
    id: "durationAdjustmentFraction",
    label: "Duration adjustment fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.noaelMgPerKgDay, "noaelMgPerKgDay");
  if (!input.uncertaintyFactors.length)
    simpleError(
      "uncertaintyFactors",
      "Nonempty caller uncertainty factors required.",
    );
  input.uncertaintyFactors.forEach((v) => {
    if (v < 1)
      simpleError(
        "uncertaintyFactors",
        "Assessment factors must be at least one.",
      );
  });
  positive(input.durationAdjustmentFraction, "durationAdjustmentFraction");
  fraction(input.durationAdjustmentFraction, "durationAdjustmentFraction");
  const compositeUncertaintyFactor = input.uncertaintyFactors.reduce(
      (a, b) => a * b,
      1,
    ),
    adjustedPointOfDepartureMgPerKgDay =
      input.noaelMgPerKgDay * input.durationAdjustmentFraction;
  return {
    compositeUncertaintyFactor,
    adjustedPointOfDepartureMgPerKgDay,
    derivedReferenceDoseMgPerKgDay:
      adjustedPointOfDepartureMgPerKgDay / compositeUncertaintyFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  noaelMgPerKgDay: 10,
  uncertaintyFactors: [10, 3],
  durationAdjustmentFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  compositeUncertaintyFactor: 30,
  adjustedPointOfDepartureMgPerKgDay: 5,
  derivedReferenceDoseMgPerKgDay: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/noael-reference-dose-factors",
  title: "NOAEL to RfD Converter",
  description:
    "Apply supplied assessment factors and exposure-duration adjustment to a NOAEL; this arithmetic derives a candidate reference dose, not an authoritative safe intake.",
  inputs: inputFields,
  outputs: [
    {
      id: "compositeUncertaintyFactor",
      label: "Composite uncertainty factor",
      kind: "number",
    },
    {
      id: "adjustedPointOfDepartureMgPerKgDay",
      label: "Adjusted point of departure mg per kg day",
      kind: "number",
    },
    {
      id: "derivedReferenceDoseMgPerKgDay",
      label: "Derived reference dose mg per kg day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      noaelMgPerKgDay: value.noaelMgPerKgDay as number,
      uncertaintyFactors: value.uncertaintyFactors as readonly number[],
      durationAdjustmentFraction: value.durationAdjustmentFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
