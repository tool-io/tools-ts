import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  pick,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly trialCount: number;
  readonly alwaysSwitch: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "trialCount", label: "Trial count", kind: "number" },
  { id: "alwaysSwitch", label: "Always switch", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  bounded(input.trialCount, "trials", 1, 10000);
  let wins = 0;
  for (let i = 0; i < input.trialCount; i++) {
    const prize = draw(0, 2, random),
      pick = draw(0, 2, random),
      eligible = [0, 1, 2].filter((v) => v !== prize && v !== pick),
      shown = eligible[draw(0, eligible.length - 1, random)],
      choice = input.alwaysSwitch
        ? [0, 1, 2].find((v) => v !== pick && v !== shown)!
        : pick;
    if (choice === prize) wins++;
  }
  return {
    wins,
    trials: input.trialCount,
    observedWinFraction: wins / input.trialCount,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", trialCount: 2, alwaysSwitch: true },
  output: {
    result: {
      wins: 1,
      trials: 2,
      observedWinFraction: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/monty-hall",
  title: "Monty Hall Simulation Calculator",
  description:
    "ActualMontyHallsimulationinformedhostalwaysopensgoat,uniformeligible door,explicitalwaysswitchpolicy;no genericuninformedhost variant. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
