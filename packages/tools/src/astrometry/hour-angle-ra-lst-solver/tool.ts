import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, wrap } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly localSiderealHours: number;
  readonly rightAscensionHours: number;
}>;
export type Output = Readonly<{ readonly signedHourAngleHours: number }>;
const inputFields = [
  { id: "localSiderealHours", label: "Local sidereal hours", kind: "number" },
  { id: "rightAscensionHours", label: "Right ascension hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    signedHourAngleHours:
      wrap(input.localSiderealHours - input.rightAscensionHours + 12, 24) - 12,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  localSiderealHours: 1,
  rightAscensionHours: 23,
} satisfies Input;
export const exampleOutput = { signedHourAngleHours: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/hour-angle-ra-lst-solver",
  title: "Hour Angle from Right Ascension and LST Solver",
  description:
    "Signed local hour angle LST−RA wrapped−12..12 hours, consistent equinox/frame/time caller supplied. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedHourAngleHours",
      label: "Signed hour angle hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      localSiderealHours: value.localSiderealHours as number,
      rightAscensionHours: value.rightAscensionHours as number,
    }),
});
export const run = tool.execute;
export default tool;
