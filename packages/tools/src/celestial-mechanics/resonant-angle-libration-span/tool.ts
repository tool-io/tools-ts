import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { wrap, signedAngle } from "../shared.js";

export type Input = Readonly<{
  readonly angleDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly unwrappedDegrees: readonly number[];
  readonly sampledHalfAmplitudeDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  if (!input.angleDegrees.length)
    simpleError(
      "angleDegrees",
      "A nonempty ordered angular time series is required.",
    );
  if (
    input.angleDegrees.some(
      (v, i) =>
        i > 0 && Math.abs(signedAngle(v - input.angleDegrees[i - 1])) === 180,
    )
  )
    simpleError(
      "angleDegrees",
      "Exactly half-turn steps are directionally ambiguous.",
    );
  const unwrappedDegrees = [wrap(input.angleDegrees[0])];
  for (let i = 1; i < input.angleDegrees.length; i++)
    unwrappedDegrees.push(
      unwrappedDegrees[i - 1] +
        signedAngle(input.angleDegrees[i] - input.angleDegrees[i - 1]),
    );
  let low = unwrappedDegrees[0],
    high = low;
  for (const v of unwrappedDegrees) {
    low = Math.min(low, v);
    high = Math.max(high, v);
  }
  return { unwrappedDegrees, sampledHalfAmplitudeDegrees: (high - low) / 2 };
};
export const exampleInput = {
  angleDegrees: [350, 355, 0, 5, 10],
} satisfies Input;
export const exampleOutput = {
  unwrappedDegrees: [350, 355, 360, 365, 370],
  sampledHalfAmplitudeDegrees: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/resonant-angle-libration-span",
  title: "Resonant Angle Libration Span",
  description:
    "Unwrap successive resonant angles using the shortest step and measure their sampled half-range; cadence must resolve steps below 180 degrees and a short span does not prove libration.",
  inputs: [{ id: "angleDegrees", label: "Angle degrees", kind: "numberList" }],
  outputs: [
    { id: "unwrappedDegrees", label: "Unwrapped degrees", kind: "numberList" },
    {
      id: "sampledHalfAmplitudeDegrees",
      label: "Sampled half amplitude degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      angleDegrees: value.angleDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
