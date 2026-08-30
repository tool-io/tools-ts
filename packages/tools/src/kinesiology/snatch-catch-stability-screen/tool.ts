import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly catchDepthPercent: number;
  readonly minimumDepthPercent: number;
  readonly maximumDepthPercent: number;
  readonly lateralSwayCentimeters: number;
  readonly maximumSwayCentimeters: number;
}>;
export type Output = Readonly<{
  readonly depthWithinRange: boolean;
  readonly swayWithinLimit: boolean;
  readonly stableCatch: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.minimumDepthPercent > input.maximumDepthPercent)
    simpleError(
      "minimumDepthPercent",
      "Minimum depth cannot exceed maximum depth.",
      "invalid_range",
    );
  const depthWithinRange =
    input.catchDepthPercent >= input.minimumDepthPercent &&
    input.catchDepthPercent <= input.maximumDepthPercent;
  const swayWithinLimit =
    input.lateralSwayCentimeters <= input.maximumSwayCentimeters;
  return {
    depthWithinRange,
    swayWithinLimit,
    stableCatch: depthWithinRange && swayWithinLimit,
  };
};

export const exampleInput = {
  catchDepthPercent: 80,
  minimumDepthPercent: 70,
  maximumDepthPercent: 100,
  lateralSwayCentimeters: 3,
  maximumSwayCentimeters: 5,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  catchDepthPercent: 60,
  minimumDepthPercent: 70,
  maximumDepthPercent: 100,
  lateralSwayCentimeters: 3,
  maximumSwayCentimeters: 5,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      catchDepthPercent: input.catchDepthPercent as number,
      minimumDepthPercent: input.minimumDepthPercent as number,
      maximumDepthPercent: input.maximumDepthPercent as number,
      lateralSwayCentimeters: input.lateralSwayCentimeters as number,
      maximumSwayCentimeters: input.maximumSwayCentimeters as number,
    }),
  description:
    "Compare snatch catch depth and sway with caller-defined stability limits.",
  id: "kinesiology/snatch-catch-stability-screen",
  inputs: [
    {
      id: "catchDepthPercent",
      label: "Catch depth",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "minimumDepthPercent",
      label: "Minimum depth",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "maximumDepthPercent",
      label: "Maximum depth",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "lateralSwayCentimeters",
      label: "Lateral sway",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
    {
      id: "maximumSwayCentimeters",
      label: "Maximum sway",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
  ],
  outputs: [
    { id: "depthWithinRange", label: "Depth within range", kind: "boolean" },
    { id: "swayWithinLimit", label: "Sway within limit", kind: "boolean" },
    { id: "stableCatch", label: "Stable catch", kind: "boolean" },
  ],
  title: "Snatch Catch Stability Screen",
});

export const run = tool.execute;
export default tool;
