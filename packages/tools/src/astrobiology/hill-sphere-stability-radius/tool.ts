import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly semimajorAxisAu: number;
  readonly eccentricity: number;
  readonly planetMassKg: number;
  readonly primaryMassKg: number;
  readonly callerStableFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "semimajorAxisAu", label: "Semimajor axis au", kind: "number" },
  { id: "eccentricity", label: "Eccentricity", kind: "number" },
  { id: "planetMassKg", label: "Planet mass kg", kind: "number" },
  { id: "primaryMassKg", label: "Primary mass kg", kind: "number" },
  {
    id: "callerStableFraction",
    label: "Caller stable fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.semimajorAxisAu, "axis");
  if (i.eccentricity < 0 || i.eccentricity >= 1) simpleError("e", "0<=e<1.");
  positive(i.planetMassKg, "planet");
  positive(i.primaryMassKg, "primary");
  if (i.planetMassKg >= i.primaryMassKg)
    simpleError("mass", "Planet mass must be smaller than primary.");
  fraction(i.callerStableFraction, "fraction");
  return {
    conditionalMoonLimitAu:
      i.semimajorAxisAu *
      (1 - i.eccentricity) *
      Math.cbrt(i.planetMassKg / (3 * i.primaryMassKg)) *
      i.callerStableFraction,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    semimajorAxisAu: 1,
    eccentricity: 0,
    planetMassKg: 3,
    primaryMassKg: 1000,
    callerStableFraction: 0.5,
  },
  output: { result: { conditionalMoonLimitAu: 0.05 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/hill-sphere-stability-radius",
  title: "Hill Sphere Stability Radius for Moons Calculator",
  description:
    "Pericenter approximate Hill radius times independently chosen moon-orbit fraction; restricted three-body approximation, not guaranteed long-term stability.",
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
