import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly dayOfYear: number;
  readonly daysInYear: number;
}>;
export type Output = Readonly<{
  readonly inverseRelativeEarthSunDistanceSquared: number;
}>;
const inputFields = [
  { id: "dayOfYear", label: "Day of year", kind: "integer" },
  { id: "daysInYear", label: "Days in year", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.dayOfYear, "dayOfYear");
  positive(input.daysInYear, "daysInYear");
  count(input.dayOfYear, "dayOfYear");
  count(input.daysInYear, "daysInYear");
  if (
    (input.daysInYear !== 365 && input.daysInYear !== 366) ||
    input.dayOfYear > input.daysInYear
  )
    simpleError("dayOfYear", "Valid day in caller 365/366-day year required.");
  return {
    inverseRelativeEarthSunDistanceSquared:
      1 + 0.033 * Math.cos((2 * Math.PI * input.dayOfYear) / input.daysInYear),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { dayOfYear: 365, daysInYear: 365 } satisfies Input;
export const exampleOutput = {
  inverseRelativeEarthSunDistanceSquared: 1.033,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/eccentricity-factor",
  title: "Solar Constant Adjustment Eccentricity Factor",
  description:
    "Evaluate FAO seasonal inverse relative Earth–Sun distance squared correction on a caller valid ordinal day/year length; not true orbital elements or a sunlight/irradiance forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "inverseRelativeEarthSunDistanceSquared",
      label: "Inverse relative earth sun distance squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dayOfYear: value.dayOfYear as number,
      daysInYear: value.daysInYear as number,
    }),
});
export const run = tool.execute;
export default tool;
