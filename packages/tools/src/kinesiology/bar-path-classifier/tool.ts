import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly horizontalPositions: readonly number[];
  readonly loopThresholdCentimeters: number;
}>;
export type Output = Readonly<{
  readonly classification: string;
  readonly directionChanges: number;
  readonly horizontalRangeCentimeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.horizontalPositions.length < 2)
    return {
      classification: "insufficient-data",
      directionChanges: 0,
      horizontalRangeCentimeters: 0,
    };
  let directionChanges = 0;
  let priorDirection = 0;
  for (let index = 1; index < input.horizontalPositions.length; index += 1) {
    const direction = Math.sign(
      input.horizontalPositions[index] - input.horizontalPositions[index - 1],
    );
    if (direction !== 0 && priorDirection !== 0 && direction !== priorDirection)
      directionChanges += 1;
    if (direction !== 0) priorDirection = direction;
  }
  const horizontalRangeCentimeters =
    Math.max(...input.horizontalPositions) -
    Math.min(...input.horizontalPositions);
  return {
    classification:
      directionChanges > 0 &&
      horizontalRangeCentimeters >= input.loopThresholdCentimeters
        ? "looping"
        : "straight",
    directionChanges,
    horizontalRangeCentimeters,
  };
};

export const exampleInput = {
  horizontalPositions: [0, 2, 1, 3],
  loopThresholdCentimeters: 2,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  horizontalPositions: [0, 1, 2, 3],
  loopThresholdCentimeters: 2,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      horizontalPositions: input.horizontalPositions as readonly number[],
      loopThresholdCentimeters: input.loopThresholdCentimeters as number,
    }),
  description:
    "Classify a measured horizontal bar path from reversals and loop magnitude.",
  id: "kinesiology/bar-path-classifier",
  inputs: [
    {
      id: "horizontalPositions",
      label: "Horizontal bar positions",
      kind: "numberList",
      unit: "cm",
    },
    {
      id: "loopThresholdCentimeters",
      label: "Loop threshold",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
  ],
  outputs: [
    {
      id: "classification",
      label: "Path classification",
      kind: "string",
      enum: ["straight", "looping", "insufficient-data"],
    },
    {
      id: "directionChanges",
      label: "Direction changes",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "horizontalRangeCentimeters",
      label: "Horizontal range",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
  ],
  title: "Bar Path Classifier",
});

export const run = tool.execute;
export default tool;
