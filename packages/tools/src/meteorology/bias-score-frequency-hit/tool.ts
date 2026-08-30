import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  contingency,
} from "../shared.js";

export type Input = Readonly<{
  readonly hits: number;
  readonly misses: number;
  readonly falseAlarms: number;
  readonly correctNegatives: number;
}>;
export type Output = Readonly<{
  readonly frequencyBiasScore: number;
  readonly observedEventCount: number;
  readonly forecastEventCount: number;
}>;
const inputFields = [
  { id: "hits", label: "Hits", kind: "integer" },
  { id: "misses", label: "Misses", kind: "integer" },
  { id: "falseAlarms", label: "False alarms", kind: "integer" },
  { id: "correctNegatives", label: "Correct negatives", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.hits, "hits");
  count(input.misses, "misses");
  count(input.falseAlarms, "falseAlarms");
  count(input.correctNegatives, "correctNegatives");
  const n = contingency(
      input.hits,
      input.misses,
      input.falseAlarms,
      input.correctNegatives,
    ),
    h = input.hits,
    m = input.misses,
    f = input.falseAlarms,
    c = input.correctNegatives;
  const observedEventCount = positive(h + m, "observedEvents"),
    forecastEventCount = h + f;
  return {
    frequencyBiasScore: forecastEventCount / observedEventCount,
    observedEventCount,
    forecastEventCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hits: 30,
  misses: 10,
  falseAlarms: 20,
  correctNegatives: 40,
} satisfies Input;
export const exampleOutput = {
  frequencyBiasScore: 1.25,
  observedEventCount: 40,
  forecastEventCount: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/bias-score-frequency-hit",
  title: "Bias Score Frequency Hit",
  description:
    "Compute forecast/observed event frequency bias from explicit binary table; overforecast bias is not hit accuracy or probability calibration.",
  inputs: inputFields,
  outputs: [
    { id: "frequencyBiasScore", label: "Frequency bias score", kind: "number" },
    { id: "observedEventCount", label: "Observed event count", kind: "number" },
    { id: "forecastEventCount", label: "Forecast event count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      hits: value.hits as number,
      misses: value.misses as number,
      falseAlarms: value.falseAlarms as number,
      correctNegatives: value.correctNegatives as number,
    }),
});
export const run = tool.execute;
export default tool;
