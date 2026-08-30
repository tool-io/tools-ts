import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, deg } from "../shared.js";

export type Input = Readonly<{
  readonly inclinationDegrees: number;
  readonly toleranceDegrees: number;
}>;
export type Output = Readonly<{
  readonly nearestCriticalDegrees: number;
  readonly separationDegrees: number;
  readonly withinTolerance: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.toleranceDegrees, "toleranceDegrees");
  if (input.inclinationDegrees < 0 || input.inclinationDegrees > 180)
    simpleError("inclinationDegrees", "Inclination must be in [0,180].");
  const first = deg(Math.acos(Math.sqrt(0.2))),
    second = 180 - first,
    nearestCriticalDegrees =
      Math.abs(input.inclinationDegrees - first) <=
      Math.abs(input.inclinationDegrees - second)
        ? first
        : second,
    separationDegrees = Math.abs(
      input.inclinationDegrees - nearestCriticalDegrees,
    );
  return {
    nearestCriticalDegrees,
    separationDegrees,
    withinTolerance: separationDegrees <= input.toleranceDegrees,
  };
};
export const exampleInput = {
  inclinationDegrees: 63.43494882292201,
  toleranceDegrees: 0.1,
} satisfies Input;
export const exampleOutput = {
  nearestCriticalDegrees: 63.43494882292201,
  separationDegrees: 0,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/j2-critical-inclination-proximity",
  title: "J2 Critical Inclination Proximity",
  description:
    "Compare inclination with both first-order J2 critical inclinations, rather than a rounded 63.4-degree reference only.",
  inputs: [
    { id: "inclinationDegrees", label: "Inclination degrees", kind: "number" },
    { id: "toleranceDegrees", label: "Tolerance degrees", kind: "number" },
  ],
  outputs: [
    {
      id: "nearestCriticalDegrees",
      label: "Nearest critical degrees",
      kind: "number",
    },
    { id: "separationDegrees", label: "Separation degrees", kind: "number" },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      inclinationDegrees: value.inclinationDegrees as number,
      toleranceDegrees: value.toleranceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
