import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, rad } from "../shared.js";

export type Input = Readonly<{
  readonly orbitalSpeed: number;
  readonly inclinationChangeDegrees: number;
}>;
export type Output = Readonly<{
  readonly planeChangeDeltaV: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.orbitalSpeed, "orbitalSpeed");
  if (
    input.inclinationChangeDegrees < 0 ||
    input.inclinationChangeDegrees > 180
  )
    simpleError(
      "inclinationChangeDegrees",
      "Plane rotation must be in [0,180].",
    );
  return {
    planeChangeDeltaV:
      2 *
      input.orbitalSpeed *
      Math.sin(rad(input.inclinationChangeDegrees) / 2),
  };
};
export const exampleInput = {
  orbitalSpeed: 2,
  inclinationChangeDegrees: 60,
} satisfies Input;
export const exampleOutput = { planeChangeDeltaV: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/pure-plane-change-impulse",
  title: "Pure Plane Change Impulse",
  description:
    "Calculate an instantaneous pure plane rotation at constant speed; actual node availability is not inferred.",
  inputs: [
    { id: "orbitalSpeed", label: "Orbital speed", kind: "number" },
    {
      id: "inclinationChangeDegrees",
      label: "Inclination change degrees",
      kind: "number",
    },
  ],
  outputs: [
    { id: "planeChangeDeltaV", label: "Plane change delta v", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      orbitalSpeed: value.orbitalSpeed as number,
      inclinationChangeDegrees: value.inclinationChangeDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
