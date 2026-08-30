import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, deg, clamp } from "../shared.js";

export type Input = Readonly<{
  readonly sunPlanetDistance: number;
  readonly planetObserverDistance: number;
  readonly sunObserverDistance: number;
}>;
export type Output = Readonly<{
  readonly phaseAngleDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.sunPlanetDistance, "sunPlanetDistance");
  positive(input.planetObserverDistance, "planetObserverDistance");
  positive(input.sunObserverDistance, "sunObserverDistance");
  const a = input.sunPlanetDistance,
    b = input.planetObserverDistance,
    c = input.sunObserverDistance;
  if (a + b < c || Math.abs(a - b) > c)
    simpleError("sunObserverDistance", "Distances must form a triangle.");
  return {
    phaseAngleDegrees: deg(
      Math.acos(clamp((a * a + b * b - c * c) / (2 * a * b))),
    ),
  };
};
export const exampleInput = {
  sunPlanetDistance: 1,
  planetObserverDistance: 1,
  sunObserverDistance: 1.4142135623730951,
} satisfies Input;
export const exampleOutput = { phaseAngleDegrees: 90 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/planetary-phase-triangle-angle",
  title: "Planetary Phase Triangle Angle",
  description:
    "Solve the Sun–planet–observer phase angle from simultaneous triangle side lengths in any common distance unit.",
  inputs: [
    { id: "sunPlanetDistance", label: "Sun planet distance", kind: "number" },
    {
      id: "planetObserverDistance",
      label: "Planet observer distance",
      kind: "number",
    },
    {
      id: "sunObserverDistance",
      label: "Sun observer distance",
      kind: "number",
    },
  ],
  outputs: [
    { id: "phaseAngleDegrees", label: "Phase angle degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sunPlanetDistance: value.sunPlanetDistance as number,
      planetObserverDistance: value.planetObserverDistance as number,
      sunObserverDistance: value.sunObserverDistance as number,
    }),
});
export const run = tool.execute;
export default tool;
