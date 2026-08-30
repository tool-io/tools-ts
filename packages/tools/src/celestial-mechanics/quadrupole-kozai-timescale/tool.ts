import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, eccentricity } from "../shared.js";

export type Input = Readonly<{
  readonly innerPeriod: number;
  readonly outerPeriod: number;
  readonly totalTripleMass: number;
  readonly perturberMass: number;
  readonly outerEccentricity: number;
}>;
export type Output = Readonly<{
  readonly cycleTimescale: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.innerPeriod, "innerPeriod");
  positive(input.outerPeriod, "outerPeriod");
  positive(input.totalTripleMass, "totalTripleMass");
  positive(input.perturberMass, "perturberMass");
  eccentricity(input.outerEccentricity);
  if (
    input.perturberMass >= input.totalTripleMass ||
    input.outerPeriod <= input.innerPeriod
  )
    simpleError(
      "perturberMass",
      "A hierarchical triple with perturber mass below total mass required.",
    );
  return {
    cycleTimescale:
      (((((8 / (15 * Math.PI)) * input.outerPeriod ** 2) / input.innerPeriod) *
        input.totalTripleMass) /
        input.perturberMass) *
      (1 - input.outerEccentricity ** 2) ** 1.5,
  };
};
export const exampleInput = {
  innerPeriod: 1,
  outerPeriod: 10,
  totalTripleMass: 3,
  perturberMass: 1,
  outerEccentricity: 0,
} satisfies Input;
export const exampleOutput = {
  cycleTimescale: 50.92958178940651,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/quadrupole-kozai-timescale",
  title: "Quadrupole Kozai Timescale",
  description:
    "Estimate a quadrupole Kozai–Lidov timescale with the 8/(15π) convention in the same units as supplied periods; not a cycle-existence test.",
  inputs: [
    { id: "innerPeriod", label: "Inner period", kind: "number" },
    { id: "outerPeriod", label: "Outer period", kind: "number" },
    { id: "totalTripleMass", label: "Total triple mass", kind: "number" },
    { id: "perturberMass", label: "Perturber mass", kind: "number" },
    { id: "outerEccentricity", label: "Outer eccentricity", kind: "number" },
  ],
  outputs: [{ id: "cycleTimescale", label: "Cycle timescale", kind: "number" }],
  calculate: (value) =>
    calculate({
      innerPeriod: value.innerPeriod as number,
      outerPeriod: value.outerPeriod as number,
      totalTripleMass: value.totalTripleMass as number,
      perturberMass: value.perturberMass as number,
      outerEccentricity: value.outerEccentricity as number,
    }),
});
export const run = tool.execute;
export default tool;
