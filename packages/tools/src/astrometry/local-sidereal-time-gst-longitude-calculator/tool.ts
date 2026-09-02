import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, wrap } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly greenwichSiderealHours: number;
  readonly eastLongitudeDegrees: number;
}>;
export type Output = Readonly<{ readonly localSiderealHours: number }>;
const inputFields = [
  {
    id: "greenwichSiderealHours",
    label: "Greenwich sidereal hours",
    kind: "number",
  },
  {
    id: "eastLongitudeDegrees",
    label: "East longitude degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (Math.abs(input.eastLongitudeDegrees) > 180)
    simpleError("longitude", "Explicit east-positive−180..180°.");
  return {
    localSiderealHours: wrap(
      input.greenwichSiderealHours + input.eastLongitudeDegrees / 15,
      24,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  greenwichSiderealHours: 23,
  eastLongitudeDegrees: 30,
} satisfies Input;
export const exampleOutput = { localSiderealHours: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/local-sidereal-time-gst-longitude-calculator",
  title: "Local Sidereal Time from GST Longitude Calculator",
  description:
    "LST from independently known GST and east-positive longitude, no date/UT/GMST or geodesy calculation. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    { id: "localSiderealHours", label: "Local sidereal hours", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      greenwichSiderealHours: value.greenwichSiderealHours as number,
      eastLongitudeDegrees: value.eastLongitudeDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
