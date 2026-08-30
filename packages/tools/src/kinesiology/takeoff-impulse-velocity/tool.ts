import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly netVerticalForceN: number;
  readonly pushOffSeconds: number;
  readonly bodyMassKg: number;
  readonly gravityMps2: number;
}>;
export type Output = Readonly<{
  readonly impulseNs: number;
  readonly takeoffVelocityMps: number;
  readonly ballisticHeightM: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.netVerticalForceN < 0 ||
    input.pushOffSeconds <= 0 ||
    input.bodyMassKg <= 0 ||
    input.gravityMps2 <= 0
  )
    simpleError(
      "bodyMassKg",
      "Nonnegative net force and positive duration, body mass, gravity required.",
    );
  const impulseNs = input.netVerticalForceN * input.pushOffSeconds,
    takeoffVelocityMps = impulseNs / input.bodyMassKg;
  return {
    impulseNs,
    takeoffVelocityMps,
    ballisticHeightM: takeoffVelocityMps ** 2 / (2 * input.gravityMps2),
  };
};
export const exampleInput = {
  netVerticalForceN: 400,
  pushOffSeconds: 0.2,
  bodyMassKg: 80,
  gravityMps2: 10,
} satisfies Input;
export const exampleOutput = {
  impulseNs: 80,
  takeoffVelocityMps: 1,
  ballisticHeightM: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/takeoff-impulse-velocity",
  title: "Takeoff Impulse Velocity",
  description:
    "Convert net takeoff impulse to velocity and ideal ballistic jump height.",
  inputs: [
    { id: "netVerticalForceN", label: "Net vertical force n", kind: "number" },
    { id: "pushOffSeconds", label: "Push off seconds", kind: "number" },
    { id: "bodyMassKg", label: "Body mass kg", kind: "number" },
    { id: "gravityMps2", label: "Gravity mps 2", kind: "number" },
  ],
  outputs: [
    { id: "impulseNs", label: "Impulse ns", kind: "number" },
    { id: "takeoffVelocityMps", label: "Takeoff velocity mps", kind: "number" },
    { id: "ballisticHeightM", label: "Ballistic height m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      netVerticalForceN: value.netVerticalForceN as number,
      pushOffSeconds: value.pushOffSeconds as number,
      bodyMassKg: value.bodyMassKg as number,
      gravityMps2: value.gravityMps2 as number,
    }),
});
export const run = tool.execute;
export default tool;
