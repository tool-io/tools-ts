import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly massJupiterUnits: number;
  readonly callerJupiterUnitMassKg: number;
  readonly callerEarthUnitMassKg: number;
}>;
export type Output = Readonly<{ readonly massEarthUnits: number }>;
const inputFields = [
  { id: "massJupiterUnits", label: "Mass jupiter units", kind: "number" },
  {
    id: "callerJupiterUnitMassKg",
    label: "Caller jupiter unit mass kg",
    kind: "number",
  },
  {
    id: "callerEarthUnitMassKg",
    label: "Caller earth unit mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerJupiterUnitMassKg, "callerJupiterUnitMassKg");
  positive(input.callerEarthUnitMassKg, "callerEarthUnitMassKg");
  nonnegative(input.massJupiterUnits, "massJupiterUnits");
  return {
    massEarthUnits:
      (input.massJupiterUnits * input.callerJupiterUnitMassKg) /
      input.callerEarthUnitMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  massJupiterUnits: 2,
  callerJupiterUnitMassKg: 1.89813e27,
  callerEarthUnitMassKg: 5.9722e24,
} satisfies Input;
export const exampleOutput = {
  massEarthUnits: 635.6552024379625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/jupiter-mass-to-earth-masses",
  title: "Jupiter Mass to Earth Masses Converter",
  description:
    "Explicit caller independently established Jupiter/Earth mass-unit convention, not confuse nominal GM ratio and actual masses/Guncertainty. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "massEarthUnits", label: "Mass earth units", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      massJupiterUnits: value.massJupiterUnits as number,
      callerJupiterUnitMassKg: value.callerJupiterUnitMassKg as number,
      callerEarthUnitMassKg: value.callerEarthUnitMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
