import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, rad } from "../shared.js";

export type Input = Readonly<{
  readonly incomingPeriapsisSpeed: number;
  readonly outgoingPeriapsisSpeed: number;
  readonly burnDirectionAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly localVelocityChange: number;
  readonly specificKineticEnergyChange: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.incomingPeriapsisSpeed, "incomingPeriapsisSpeed");
  nonnegative(input.outgoingPeriapsisSpeed, "outgoingPeriapsisSpeed");
  if (
    input.burnDirectionAngleDegrees < 0 ||
    input.burnDirectionAngleDegrees > 180
  )
    simpleError(
      "burnDirectionAngleDegrees",
      "Velocity-direction angle must lie within [0,180].",
    );
  return {
    localVelocityChange: Math.sqrt(
      Math.max(
        0,
        input.incomingPeriapsisSpeed ** 2 +
          input.outgoingPeriapsisSpeed ** 2 -
          2 *
            input.incomingPeriapsisSpeed *
            input.outgoingPeriapsisSpeed *
            Math.cos(rad(input.burnDirectionAngleDegrees)),
      ),
    ),
    specificKineticEnergyChange:
      (input.outgoingPeriapsisSpeed ** 2 - input.incomingPeriapsisSpeed ** 2) /
      2,
  };
};
export const exampleInput = {
  incomingPeriapsisSpeed: 3,
  outgoingPeriapsisSpeed: 4,
  burnDirectionAngleDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  localVelocityChange: 5,
  specificKineticEnergyChange: 3.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/powered-flyby-velocity-budget",
  title: "Powered Flyby Velocity Budget",
  description:
    "Budget a local powered-flyby velocity vector change and specific kinetic-energy change from supplied periapsis speeds and angle; no B-plane trajectory is solved.",
  inputs: [
    {
      id: "incomingPeriapsisSpeed",
      label: "Incoming periapsis speed",
      kind: "number",
    },
    {
      id: "outgoingPeriapsisSpeed",
      label: "Outgoing periapsis speed",
      kind: "number",
    },
    {
      id: "burnDirectionAngleDegrees",
      label: "Burn direction angle degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "localVelocityChange",
      label: "Local velocity change",
      kind: "number",
    },
    {
      id: "specificKineticEnergyChange",
      label: "Specific kinetic energy change",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      incomingPeriapsisSpeed: value.incomingPeriapsisSpeed as number,
      outgoingPeriapsisSpeed: value.outgoingPeriapsisSpeed as number,
      burnDirectionAngleDegrees: value.burnDirectionAngleDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
