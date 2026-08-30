import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly quadrantActorSeconds: readonly number[];
  readonly maximumImbalancePercent: number;
}>;
export type Output = Readonly<{
  readonly meanQuadrantActorSeconds: number;
  readonly maximumDeviationPercent: number;
  readonly leastUsedQuadrant: number;
  readonly balanced: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.quadrantActorSeconds.length !== 4 ||
    input.quadrantActorSeconds.some((value) => value < 0)
  )
    simpleError(
      "quadrantActorSeconds",
      "Exactly four nonnegative quadrant totals are required.",
      "invalid_quadrants",
    );
  const meanQuadrantActorSeconds =
    input.quadrantActorSeconds.reduce((a, b) => a + b, 0) / 4;
  if (meanQuadrantActorSeconds === 0)
    simpleError(
      "quadrantActorSeconds",
      "Mean use must be positive.",
      "zero_use",
    );
  const deviations = input.quadrantActorSeconds.map(
    (value) =>
      (Math.abs(value - meanQuadrantActorSeconds) / meanQuadrantActorSeconds) *
      100,
  );
  return {
    meanQuadrantActorSeconds,
    maximumDeviationPercent: Math.max(...deviations),
    leastUsedQuadrant:
      input.quadrantActorSeconds.indexOf(
        Math.min(...input.quadrantActorSeconds),
      ) + 1,
    balanced: Math.max(...deviations) <= input.maximumImbalancePercent,
  };
};

export const exampleInput = {
  quadrantActorSeconds: [100, 100, 80, 120],
  maximumImbalancePercent: 25,
} satisfies Input;
export const exampleOutput = {
  meanQuadrantActorSeconds: 100,
  maximumDeviationPercent: 20,
  leastUsedQuadrant: 3,
  balanced: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      quadrantActorSeconds: input.quadrantActorSeconds as readonly number[],
      maximumImbalancePercent: input.maximumImbalancePercent as number,
    }),
  description:
    "Measure arena-stage blocking balance across four audience quadrants.",
  id: "theatre/arena-blocking-balance",
  inputs: [
    {
      id: "quadrantActorSeconds",
      label: "Actor-seconds by arena quadrant",
      kind: "numberList",
      unit: "actor·s",
    },
    {
      id: "maximumImbalancePercent",
      label: "Maximum quadrant imbalance",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "meanQuadrantActorSeconds",
      label: "Mean quadrant actor-seconds",
      kind: "number",
      minimum: 0,
      unit: "actor·s",
    },
    {
      id: "maximumDeviationPercent",
      label: "Maximum deviation from mean",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "leastUsedQuadrant",
      label: "One-based least-used quadrant",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "balanced",
      label: "Within supplied imbalance limit",
      kind: "boolean",
    },
  ],
  title: "Arena Blocking Balance",
});

export const run = tool.execute;
export default tool;
