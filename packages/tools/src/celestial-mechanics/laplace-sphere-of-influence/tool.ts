import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly orbitalSemimajorAxis: number;
  readonly secondaryMass: number;
  readonly primaryMass: number;
}>;
export type Output = Readonly<{
  readonly influenceRadius: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.orbitalSemimajorAxis, "orbitalSemimajorAxis");
  positive(input.secondaryMass, "secondaryMass");
  positive(input.primaryMass, "primaryMass");
  if (input.secondaryMass >= input.primaryMass)
    simpleError(
      "secondaryMass",
      "Laplace small-secondary approximation requires secondary mass below primary mass.",
    );
  return {
    influenceRadius:
      input.orbitalSemimajorAxis *
      (input.secondaryMass / input.primaryMass) ** 0.4,
  };
};
export const exampleInput = {
  orbitalSemimajorAxis: 10,
  secondaryMass: 1,
  primaryMass: 100000,
} satisfies Input;
export const exampleOutput = { influenceRadius: 0.1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/laplace-sphere-of-influence",
  title: "Laplace Sphere Of Influence",
  description:
    "Compute the Laplace sphere-of-influence scale a(m/M)^(2/5), not a Hill-stability radius.",
  inputs: [
    {
      id: "orbitalSemimajorAxis",
      label: "Orbital semimajor axis",
      kind: "number",
    },
    { id: "secondaryMass", label: "Secondary mass", kind: "number" },
    { id: "primaryMass", label: "Primary mass", kind: "number" },
  ],
  outputs: [
    { id: "influenceRadius", label: "Influence radius", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      orbitalSemimajorAxis: value.orbitalSemimajorAxis as number,
      secondaryMass: value.secondaryMass as number,
      primaryMass: value.primaryMass as number,
    }),
});
export const run = tool.execute;
export default tool;
