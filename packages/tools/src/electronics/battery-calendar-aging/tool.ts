import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  interpolate,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly storageAgeYears: readonly number[];
  readonly observedRemainingCapacityFractions: readonly number[];
  readonly queryStorageAgeYears: number;
}>;
export type Output = Readonly<{
  readonly interpolatedStorageCapacityFraction: number;
  readonly observedCalendarCapacityLossFraction: number;
}>;
const inputFields = [
  { id: "storageAgeYears", label: "Storage age years", kind: "numberList" },
  {
    id: "observedRemainingCapacityFractions",
    label: "Observed remaining capacity fractions",
    kind: "numberList",
  },
  {
    id: "queryStorageAgeYears",
    label: "Query storage age years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.storageAgeYears.forEach((v) => nonnegative(v, "storageAgeYears"));
  nonnegative(input.queryStorageAgeYears, "queryStorageAgeYears");
  input.observedRemainingCapacityFractions.forEach((v) =>
    fraction(v, "observedRemainingCapacityFractions"),
  );
  aligned(
    input.storageAgeYears,
    input.observedRemainingCapacityFractions,
    "storageAgeYears",
  );
  if (
    input.observedRemainingCapacityFractions.some(
      (v, i) => i > 0 && v > input.observedRemainingCapacityFractions[i - 1],
    )
  )
    simpleError(
      "capacity",
      "Nonincreasing matched storage-only capacity evidence required; cycling/conditions external.",
    );
  const q = interpolate(
    input.storageAgeYears,
    input.observedRemainingCapacityFractions,
    input.queryStorageAgeYears,
  );
  return {
    interpolatedStorageCapacityFraction: q,
    observedCalendarCapacityLossFraction: 1 - q,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  storageAgeYears: [0, 1, 4],
  observedRemainingCapacityFractions: [1, 0.9, 0.8],
  queryStorageAgeYears: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedStorageCapacityFraction: 0.85,
  observedCalendarCapacityLossFraction: 0.15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/battery-calendar-aging",
  title: "Battery Calendar Aging Calculator",
  description:
    "Read observed matched storage-only capacity-aging curve within age range; no invented chemistry/calendar square-root law, extrapolated life or separating cycling losses without independent evidence.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedStorageCapacityFraction",
      label: "Interpolated storage capacity fraction",
      kind: "number",
    },
    {
      id: "observedCalendarCapacityLossFraction",
      label: "Observed calendar capacity loss fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      storageAgeYears: value.storageAgeYears as readonly number[],
      observedRemainingCapacityFractions:
        value.observedRemainingCapacityFractions as readonly number[],
      queryStorageAgeYears: value.queryStorageAgeYears as number,
    }),
});
export const run = tool.execute;
export default tool;
