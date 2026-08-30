import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly stellarRadius: number;
  readonly centralMass: number;
  readonly stellarMass: number;
}>;
export type Output = Readonly<{
  readonly disruptionRadius: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.stellarRadius, "stellarRadius");
  positive(input.centralMass, "centralMass");
  positive(input.stellarMass, "stellarMass");
  return {
    disruptionRadius:
      input.stellarRadius * Math.cbrt(input.centralMass / input.stellarMass),
  };
};
export const exampleInput = {
  stellarRadius: 1,
  centralMass: 8000,
  stellarMass: 1,
} satisfies Input;
export const exampleOutput = { disruptionRadius: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/stellar-tidal-disruption-radius",
  title: "Stellar Tidal Disruption Radius",
  description:
    "Estimate the Newtonian stellar tidal radius using a point central mass; relativistic capture and stellar structure are not modeled.",
  inputs: [
    { id: "stellarRadius", label: "Stellar radius", kind: "number" },
    { id: "centralMass", label: "Central mass", kind: "number" },
    { id: "stellarMass", label: "Stellar mass", kind: "number" },
  ],
  outputs: [
    { id: "disruptionRadius", label: "Disruption radius", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stellarRadius: value.stellarRadius as number,
      centralMass: value.centralMass as number,
      stellarMass: value.stellarMass as number,
    }),
});
export const run = tool.execute;
export default tool;
