import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{ readonly callerJulianDate: number }>;
export type Output = Readonly<{ readonly julianEpoch: number }>;
const inputFields = [
  { id: "callerJulianDate", label: "Caller julian date", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { julianEpoch: 2000 + (input.callerJulianDate - 2451545) / 365.25 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { callerJulianDate: 2451545 } satisfies Input;
export const exampleOutput = { julianEpoch: 2000 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/julian-epoch-fractional-year-calculator",
  title: "Julian Epoch from Calendar Date Fractional Year Calculator",
  description:
    "Julian epoch from independently time-scale-resolved Julian Date via J 2000 anchor and 365.25 days, not Gregorian fractional-year elapsed fraction. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [{ id: "julianEpoch", label: "Julian epoch", kind: "number" }],
  calculate: (value) =>
    calculate({ callerJulianDate: value.callerJulianDate as number }),
});
export const run = tool.execute;
export default tool;
