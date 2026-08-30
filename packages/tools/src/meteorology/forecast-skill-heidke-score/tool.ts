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
  readonly heidkeSkillScore: number;
  readonly observedAccuracy: number;
  readonly chanceAgreement: number;
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
  const chance = ((h + m) * (h + f) + (c + m) * (c + f)) / (n * n);
  return {
    heidkeSkillScore:
      // Algebraic table form avoids subtracting chance agreement rounded to 1
      // in a highly imbalanced but nondegenerate exact-count inventory.
      (2 * (h * c - m * f)) /
      positive((h + m) * (m + c) + (h + f) * (f + c), "nondegenerateChance"),
    observedAccuracy: (h + c) / n,
    chanceAgreement: chance,
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
  heidkeSkillScore: 0.4,
  observedAccuracy: 0.7,
  chanceAgreement: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/forecast-skill-heidke-score",
  title: "Forecast Skill Heidke Score",
  description:
    "Compute binary Heidke skill against marginal chance agreement on explicit observed contingency counts; undefined degenerate chance is rejected, no independence confidence interval or operational forecast quality certification.",
  inputs: inputFields,
  outputs: [
    { id: "heidkeSkillScore", label: "Heidke skill score", kind: "number" },
    { id: "observedAccuracy", label: "Observed accuracy", kind: "number" },
    { id: "chanceAgreement", label: "Chance agreement", kind: "number" },
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
