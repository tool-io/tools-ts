import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly innerSemimajorAxis: number;
  readonly outerSemimajorAxis: number;
  readonly firstPlanetMass: number;
  readonly secondPlanetMass: number;
  readonly starMass: number;
  readonly minimumHillSeparation: number;
}>;
export type Output = Readonly<{
  readonly mutualHillRadius: number;
  readonly hillSeparation: number;
  readonly aboveSuppliedBoundary: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.innerSemimajorAxis, "innerSemimajorAxis");
  positive(input.outerSemimajorAxis, "outerSemimajorAxis");
  nonnegative(input.firstPlanetMass, "firstPlanetMass");
  nonnegative(input.secondPlanetMass, "secondPlanetMass");
  positive(input.starMass, "starMass");
  positive(input.minimumHillSeparation, "minimumHillSeparation");
  if (input.outerSemimajorAxis <= input.innerSemimajorAxis)
    simpleError(
      "outerSemimajorAxis",
      "Ordered planet semimajor axes required.",
    );
  const mutualHillRadius =
    ((input.innerSemimajorAxis + input.outerSemimajorAxis) / 2) *
    Math.cbrt(
      (input.firstPlanetMass + input.secondPlanetMass) / (3 * input.starMass),
    );
  positive(mutualHillRadius, "firstPlanetMass");
  const hillSeparation =
    (input.outerSemimajorAxis - input.innerSemimajorAxis) / mutualHillRadius;
  return {
    mutualHillRadius,
    hillSeparation,
    aboveSuppliedBoundary: hillSeparation > input.minimumHillSeparation,
  };
};
export const exampleInput = {
  innerSemimajorAxis: 1,
  outerSemimajorAxis: 2,
  firstPlanetMass: 1,
  secondPlanetMass: 1,
  starMass: 1000,
  minimumHillSeparation: 3.4641016151377544,
} satisfies Input;
export const exampleOutput = {
  mutualHillRadius: 0.13103706971044485,
  hillSeparation: 7.631428283688878,
  aboveSuppliedBoundary: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/mutual-hill-separation",
  title: "Mutual Hill Separation",
  description:
    "Compute mutual-Hill separation and screen a supplied boundary; the conventional 2√3 criterion assumes small, circular, coplanar two-planet orbits.",
  inputs: [
    { id: "innerSemimajorAxis", label: "Inner semimajor axis", kind: "number" },
    { id: "outerSemimajorAxis", label: "Outer semimajor axis", kind: "number" },
    { id: "firstPlanetMass", label: "First planet mass", kind: "number" },
    { id: "secondPlanetMass", label: "Second planet mass", kind: "number" },
    { id: "starMass", label: "Star mass", kind: "number" },
    {
      id: "minimumHillSeparation",
      label: "Minimum hill separation",
      kind: "number",
    },
  ],
  outputs: [
    { id: "mutualHillRadius", label: "Mutual hill radius", kind: "number" },
    { id: "hillSeparation", label: "Hill separation", kind: "number" },
    {
      id: "aboveSuppliedBoundary",
      label: "Above supplied boundary",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      innerSemimajorAxis: value.innerSemimajorAxis as number,
      outerSemimajorAxis: value.outerSemimajorAxis as number,
      firstPlanetMass: value.firstPlanetMass as number,
      secondPlanetMass: value.secondPlanetMass as number,
      starMass: value.starMass as number,
      minimumHillSeparation: value.minimumHillSeparation as number,
    }),
});
export const run = tool.execute;
export default tool;
