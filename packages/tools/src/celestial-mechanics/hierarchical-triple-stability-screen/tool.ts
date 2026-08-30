import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, eccentricity } from "../shared.js";

export type Input = Readonly<{
  readonly innerSemimajorAxis: number;
  readonly outerSemimajorAxis: number;
  readonly outerEccentricity: number;
  readonly outerInnerMassRatio: number;
  readonly mutualInclinationDegrees: number;
}>;
export type Output = Readonly<{
  readonly requiredAxisRatio: number;
  readonly actualAxisRatio: number;
  readonly aboveEmpiricalBoundary: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.innerSemimajorAxis, "innerSemimajorAxis");
  positive(input.outerSemimajorAxis, "outerSemimajorAxis");
  eccentricity(input.outerEccentricity);
  nonnegative(input.outerInnerMassRatio, "outerInnerMassRatio");
  if (
    input.mutualInclinationDegrees < 0 ||
    input.mutualInclinationDegrees > 180
  )
    simpleError("mutualInclinationDegrees", "Inclination must be in [0,180].");
  const e = input.outerEccentricity,
    requiredAxisRatio =
      ((2.8 * (1 + input.outerInnerMassRatio) ** 0.4 * (1 + e) ** 0.4) /
        (1 - e) ** 1.2) *
      (1 - (0.3 * input.mutualInclinationDegrees) / 180),
    actualAxisRatio = input.outerSemimajorAxis / input.innerSemimajorAxis;
  return {
    requiredAxisRatio,
    actualAxisRatio,
    aboveEmpiricalBoundary: actualAxisRatio > requiredAxisRatio,
  };
};
export const exampleInput = {
  innerSemimajorAxis: 1,
  outerSemimajorAxis: 5,
  outerEccentricity: 0,
  outerInnerMassRatio: 1,
  mutualInclinationDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  requiredAxisRatio: 3.6946221501641037,
  actualAxisRatio: 5,
  aboveEmpiricalBoundary: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/hierarchical-triple-stability-screen",
  title: "Hierarchical Triple Stability Screen",
  description:
    "Screen the Mardling–Aarseth hierarchical-triple empirical axis-ratio boundary; not a general N-body stability proof.",
  inputs: [
    { id: "innerSemimajorAxis", label: "Inner semimajor axis", kind: "number" },
    { id: "outerSemimajorAxis", label: "Outer semimajor axis", kind: "number" },
    { id: "outerEccentricity", label: "Outer eccentricity", kind: "number" },
    {
      id: "outerInnerMassRatio",
      label: "Outer inner mass ratio",
      kind: "number",
    },
    {
      id: "mutualInclinationDegrees",
      label: "Mutual inclination degrees",
      kind: "number",
    },
  ],
  outputs: [
    { id: "requiredAxisRatio", label: "Required axis ratio", kind: "number" },
    { id: "actualAxisRatio", label: "Actual axis ratio", kind: "number" },
    {
      id: "aboveEmpiricalBoundary",
      label: "Above empirical boundary",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      innerSemimajorAxis: value.innerSemimajorAxis as number,
      outerSemimajorAxis: value.outerSemimajorAxis as number,
      outerEccentricity: value.outerEccentricity as number,
      outerInnerMassRatio: value.outerInnerMassRatio as number,
      mutualInclinationDegrees: value.mutualInclinationDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
