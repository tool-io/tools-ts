import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad } from "../shared.js";

export type Input = Readonly<{
  readonly altitudeDegrees: number;
}>;
export type Output = Readonly<{
  readonly relativeAirmass: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.altitudeDegrees < 0 || input.altitudeDegrees > 90)
    simpleError(
      "altitudeDegrees",
      "Apparent altitude must lie in [0,90] degrees.",
    );
  return {
    relativeAirmass:
      1 /
      (Math.sin(rad(input.altitudeDegrees)) +
        0.50572 * (input.altitudeDegrees + 6.07995) ** -1.6364),
  };
};
export const exampleInput = { altitudeDegrees: 30 } satisfies Input;
export const exampleOutput = {
  relativeAirmass: 1.9942928525292498,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/kasten-young-optical-airmass",
  title: "Kasten Young Optical Airmass",
  description:
    "Evaluate Kasten–Young relative optical air mass for apparent altitude above the horizon; this is an atmospheric model approximation.",
  inputs: [
    { id: "altitudeDegrees", label: "Altitude degrees", kind: "number" },
  ],
  outputs: [
    { id: "relativeAirmass", label: "Relative airmass", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      altitudeDegrees: value.altitudeDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
