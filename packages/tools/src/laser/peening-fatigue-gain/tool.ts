import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly baselineFatigueCycles: number;
  readonly peenedFatigueCycles: number;
}>;
export type Output = Readonly<{
  readonly fatigueLifeRatio: number;
  readonly fatigueLifeGainPercent: number;
  readonly additionalCycles: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.baselineFatigueCycles <= 0)
    simpleError(
      "baselineFatigueCycles",
      "Baseline fatigue life must be positive.",
      "invalid_baseline",
    );
  const fatigueLifeRatio =
    input.peenedFatigueCycles / input.baselineFatigueCycles;
  return {
    fatigueLifeRatio,
    fatigueLifeGainPercent: (fatigueLifeRatio - 1) * 100,
    additionalCycles: input.peenedFatigueCycles - input.baselineFatigueCycles,
  };
};

export const exampleInput = {
  baselineFatigueCycles: 1000,
  peenedFatigueCycles: 1500,
} satisfies Input;
export const exampleOutput = {
  fatigueLifeRatio: 1.5,
  fatigueLifeGainPercent: 50,
  additionalCycles: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      baselineFatigueCycles: input.baselineFatigueCycles as number,
      peenedFatigueCycles: input.peenedFatigueCycles as number,
    }),
  description:
    "Quantify measured fatigue-life improvement after laser shock peening.",
  id: "laser/peening-fatigue-gain",
  inputs: [
    {
      id: "baselineFatigueCycles",
      label: "Baseline fatigue life",
      kind: "number",
      minimum: 0,
      unit: "cycles",
    },
    {
      id: "peenedFatigueCycles",
      label: "Peened fatigue life",
      kind: "number",
      minimum: 0,
      unit: "cycles",
    },
  ],
  outputs: [
    {
      id: "fatigueLifeRatio",
      label: "Peened-to-baseline life ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "fatigueLifeGainPercent",
      label: "Fatigue-life gain",
      kind: "number",
      unit: "%",
    },
    {
      id: "additionalCycles",
      label: "Additional fatigue cycles",
      kind: "number",
      unit: "cycles",
    },
  ],
  title: "Peening Fatigue Gain",
});

export const run = tool.execute;
export default tool;
