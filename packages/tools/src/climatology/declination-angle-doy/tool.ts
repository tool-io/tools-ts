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
  readonly faoSolarDeclinationRadians: number;
  readonly faoSolarDeclinationDegrees: number;
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
  const faoSolarDeclinationRadians =
    0.409 * Math.sin((2 * Math.PI * input.dayOfYear) / input.daysInYear - 1.39);
  return {
    faoSolarDeclinationRadians,
    faoSolarDeclinationDegrees: (faoSolarDeclinationRadians * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { dayOfYear: 81, daysInYear: 365 } satisfies Input;
export const exampleOutput = {
  faoSolarDeclinationRadians: 0.0017794355959882655,
  faoSolarDeclinationDegrees: 0.1019541495654739,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/declination-angle-doy",
  title: "Declination Angle Day-of-Year",
  description:
    "Evaluate named approximate FAO ordinal-day solar declination, not NOAA date/location sunrise calculation, sidereal astrometry or a geodesy operation.",
  inputs: inputFields,
  outputs: [
    {
      id: "faoSolarDeclinationRadians",
      label: "Fao solar declination radians",
      kind: "number",
    },
    {
      id: "faoSolarDeclinationDegrees",
      label: "Fao solar declination degrees",
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
