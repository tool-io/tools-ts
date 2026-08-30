import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, vector, norm, dot, rotate } from "../shared.js";

export type Input = Readonly<{
  readonly incomingPlanetRelativeVelocity: readonly number[];
  readonly planetHeliocentricVelocity: readonly number[];
  readonly turnAxis: readonly number[];
  readonly turnAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly outgoingHeliocentricVelocity: readonly number[];
  readonly heliocentricSpeedGain: number;
  readonly specificEnergyChange: number;
}>;
export const calculate = (input: Input): Output => {
  vector(
    input.incomingPlanetRelativeVelocity,
    "incomingPlanetRelativeVelocity",
  );
  vector(input.planetHeliocentricVelocity, "planetHeliocentricVelocity");
  if (Math.abs(input.turnAngleDegrees) > 180)
    simpleError(
      "turnAngleDegrees",
      "A signed turn within ±180 degrees required.",
    );
  const turned = rotate(
      input.incomingPlanetRelativeVelocity,
      input.turnAxis,
      rad(input.turnAngleDegrees),
    ),
    incoming = input.incomingPlanetRelativeVelocity.map(
      (v, i) => v + input.planetHeliocentricVelocity[i],
    ),
    outgoingHeliocentricVelocity = turned.map(
      (v, i) => v + input.planetHeliocentricVelocity[i],
    );
  return {
    outgoingHeliocentricVelocity,
    heliocentricSpeedGain: norm(outgoingHeliocentricVelocity) - norm(incoming),
    specificEnergyChange:
      (dot(outgoingHeliocentricVelocity, outgoingHeliocentricVelocity) -
        dot(incoming, incoming)) /
      2,
  };
};
export const exampleInput = {
  incomingPlanetRelativeVelocity: [1, 0, 0],
  planetHeliocentricVelocity: [0, 1, 0],
  turnAxis: [0, 0, 1],
  turnAngleDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  outgoingHeliocentricVelocity: [0, 2, 0],
  heliocentricSpeedGain: 0.5857864376269049,
  specificEnergyChange: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/gravity-assist-velocity-rotation",
  title: "Gravity Assist Velocity Rotation",
  description:
    "Rotate a planet-frame excess-velocity vector and transform it back to the heliocentric frame under an ideal unpowered flyby.",
  inputs: [
    {
      id: "incomingPlanetRelativeVelocity",
      label: "Incoming planet relative velocity",
      kind: "numberList",
    },
    {
      id: "planetHeliocentricVelocity",
      label: "Planet heliocentric velocity",
      kind: "numberList",
    },
    { id: "turnAxis", label: "Turn axis", kind: "numberList" },
    { id: "turnAngleDegrees", label: "Turn angle degrees", kind: "number" },
  ],
  outputs: [
    {
      id: "outgoingHeliocentricVelocity",
      label: "Outgoing heliocentric velocity",
      kind: "numberList",
    },
    {
      id: "heliocentricSpeedGain",
      label: "Heliocentric speed gain",
      kind: "number",
    },
    {
      id: "specificEnergyChange",
      label: "Specific energy change",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      incomingPlanetRelativeVelocity:
        value.incomingPlanetRelativeVelocity as readonly number[],
      planetHeliocentricVelocity:
        value.planetHeliocentricVelocity as readonly number[],
      turnAxis: value.turnAxis as readonly number[],
      turnAngleDegrees: value.turnAngleDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
