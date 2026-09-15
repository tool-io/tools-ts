import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
  rad,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly periodSeconds: number;
  readonly planetMassKg: number;
  readonly starMassKg: number;
  readonly inclinationDegrees: number;
  readonly eccentricity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "periodSeconds", label: "Period seconds", kind: "number" },
  { id: "planetMassKg", label: "Planet mass kg", kind: "number" },
  { id: "starMassKg", label: "Star mass kg", kind: "number" },
  { id: "inclinationDegrees", label: "Inclination degrees", kind: "number" },
  { id: "eccentricity", label: "Eccentricity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.periodSeconds, "period");
  nonnegative(i.planetMassKg, "planet");
  positive(i.starMassKg, "star");
  angle(i.inclinationDegrees, "inclination", 0, 180);
  if (i.eccentricity < 0 || i.eccentricity >= 1) simpleError("e", "0<=e<1.");
  return {
    semiAmplitudeMPerS:
      (((2 * Math.PI * 6.6743e-11) / i.periodSeconds) ** (1 / 3) *
        i.planetMassKg *
        Math.sin(rad(i.inclinationDegrees))) /
      (i.starMassKg + i.planetMassKg) ** (2 / 3) /
      Math.sqrt(1 - i.eccentricity ** 2),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    periodSeconds: 100000,
    planetMassKg: 1e20,
    starMassKg: 1e30,
    inclinationDegrees: 90,
    eccentricity: 0,
  },
  output: { result: { semiAmplitudeMPerS: 1.6126069628360346e-5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/radial-velocity-semiamplitude-k-calculator",
  title: "Radial Velocity Semi-Amplitude K m/s Calculator",
  description:
    "Keplerian two-body stellar radial-velocity semi-amplitude in m/s with full total-mass denominator; no detectability/activity model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
