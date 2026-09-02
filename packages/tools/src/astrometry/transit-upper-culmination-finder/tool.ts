import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, wrap } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly currentLocalSiderealHours: number;
  readonly rightAscensionHours: number;
  readonly callerSiderealAdvanceHoursPerClockHour: number;
}>;
export type Output = Readonly<{
  readonly clockHoursUntilNextUpperTransit: number;
}>;
const inputFields = [
  {
    id: "currentLocalSiderealHours",
    label: "Current local sidereal hours",
    kind: "number",
  },
  { id: "rightAscensionHours", label: "Right ascension hours", kind: "number" },
  {
    id: "callerSiderealAdvanceHoursPerClockHour",
    label: "Caller sidereal advance hours per clock hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerSiderealAdvanceHoursPerClockHour,
    "callerSiderealAdvanceHoursPerClockHour",
  );
  return {
    clockHoursUntilNextUpperTransit:
      wrap(input.rightAscensionHours - input.currentLocalSiderealHours, 24) /
      input.callerSiderealAdvanceHoursPerClockHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentLocalSiderealHours: 1,
  rightAscensionHours: 2,
  callerSiderealAdvanceHoursPerClockHour: 1.00273790935,
} satisfies Input;
export const exampleOutput = {
  clockHoursUntilNextUpperTransit: 0.9972695663298751,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/transit-upper-culmination-finder",
  title: "Transit Time Upper Culmination Hour Finder",
  description:
    "Next upper transit delay from independent current LST and caller sidereal/clock-rate conversion, no actual calendar ephemeris or precession. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "clockHoursUntilNextUpperTransit",
      label: "Clock hours until next upper transit",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      currentLocalSiderealHours: value.currentLocalSiderealHours as number,
      rightAscensionHours: value.rightAscensionHours as number,
      callerSiderealAdvanceHoursPerClockHour:
        value.callerSiderealAdvanceHoursPerClockHour as number,
    }),
});
export const run = tool.execute;
export default tool;
