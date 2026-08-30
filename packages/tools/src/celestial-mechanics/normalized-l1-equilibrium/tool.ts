import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { collinearRoot } from "../shared.js";

export type Input = Readonly<{
  readonly massFraction: number;
}>;
export type Output = Readonly<{
  readonly barycentricX: number;
  readonly distanceFromSmallerPrimary: number;
}>;
export const calculate = (input: Input): Output => {
  const barycentricX = collinearRoot(input.massFraction, "L1");
  return {
    barycentricX,
    distanceFromSmallerPrimary: 1 - input.massFraction - barycentricX,
  };
};
export const exampleInput = { massFraction: 0.5 } satisfies Input;
export const exampleOutput = {
  barycentricX: 0,
  distanceFromSmallerPrimary: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/normalized-l1-equilibrium",
  title: "Normalized L1 Equilibrium",
  description:
    "Solve the normalized rotating-frame L1 equilibrium numerically; separation is one and mass fraction refers to the smaller primary.",
  inputs: [
    {
      id: "massFraction",
      label: "Mass fraction",
      kind: "number",
      minimum: 1e-15,
      maximum: 0.5,
      description:
        "Smaller-primary mass divided by total primary mass; numerical support is [1e-15,0.5].",
    },
  ],
  outputs: [
    { id: "barycentricX", label: "Barycentric x", kind: "number" },
    {
      id: "distanceFromSmallerPrimary",
      label: "Distance from smaller primary",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      massFraction: value.massFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
