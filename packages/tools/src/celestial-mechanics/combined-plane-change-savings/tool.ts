import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, rad } from "../shared.js";

export type Input = Readonly<{
  readonly incomingSpeed: number;
  readonly outgoingSpeed: number;
  readonly planeAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly combinedDeltaV: number;
  readonly separateDeltaV: number;
  readonly savedDeltaV: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.incomingSpeed, "incomingSpeed");
  nonnegative(input.outgoingSpeed, "outgoingSpeed");
  if (input.planeAngleDegrees < 0 || input.planeAngleDegrees > 180)
    simpleError("planeAngleDegrees", "Plane angle must be in [0,180].");
  const combinedDeltaV = Math.sqrt(
      Math.max(
        0,
        input.incomingSpeed ** 2 +
          input.outgoingSpeed ** 2 -
          2 *
            input.incomingSpeed *
            input.outgoingSpeed *
            Math.cos(rad(input.planeAngleDegrees)),
      ),
    ),
    separateDeltaV =
      Math.abs(input.outgoingSpeed - input.incomingSpeed) +
      2 *
        Math.min(input.incomingSpeed, input.outgoingSpeed) *
        Math.sin(rad(input.planeAngleDegrees) / 2);
  return {
    combinedDeltaV,
    separateDeltaV,
    savedDeltaV: separateDeltaV - combinedDeltaV,
  };
};
export const exampleInput = {
  incomingSpeed: 3,
  outgoingSpeed: 4,
  planeAngleDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  combinedDeltaV: 5,
  separateDeltaV: 5.242640687119286,
  savedDeltaV: 0.24264068711928566,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/combined-plane-change-savings",
  title: "Combined Plane Change Savings",
  description:
    "Compare a combined speed/plane-change impulse with speed change plus a plane change at the lower endpoint speed; geometry must be co-located.",
  inputs: [
    { id: "incomingSpeed", label: "Incoming speed", kind: "number" },
    { id: "outgoingSpeed", label: "Outgoing speed", kind: "number" },
    { id: "planeAngleDegrees", label: "Plane angle degrees", kind: "number" },
  ],
  outputs: [
    { id: "combinedDeltaV", label: "Combined delta v", kind: "number" },
    { id: "separateDeltaV", label: "Separate delta v", kind: "number" },
    { id: "savedDeltaV", label: "Saved delta v", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      incomingSpeed: value.incomingSpeed as number,
      outgoingSpeed: value.outgoingSpeed as number,
      planeAngleDegrees: value.planeAngleDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
