import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedBeetleEntryHolesCounts: readonly number[];
  readonly observedAssessedBarkAreaM2: readonly number[];
  readonly observedUnassessedBarkAreaM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownPooledEvidenceDensity: number;
  readonly unassessedExposureFraction: number;
}>;
const inputFields = [
  {
    id: "observedBeetleEntryHolesCounts",
    label: "Observed beetle entry holes counts",
    kind: "numberList",
  },
  {
    id: "observedAssessedBarkAreaM2",
    label: "Observed assessed bark area m2",
    kind: "numberList",
  },
  {
    id: "observedUnassessedBarkAreaM2",
    label: "Observed unassessed bark area m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAssessedBarkAreaM2.forEach((v) =>
    positive(v, "observedAssessedBarkAreaM2"),
  );
  input.observedUnassessedBarkAreaM2.forEach((v) =>
    nonnegative(v, "observedUnassessedBarkAreaM2"),
  );
  aligned(
    input.observedBeetleEntryHolesCounts,
    input.observedAssessedBarkAreaM2,
    "observedBeetleEntryHolesCounts",
  );
  aligned(
    input.observedBeetleEntryHolesCounts,
    input.observedUnassessedBarkAreaM2,
    "observedBeetleEntryHolesCounts",
  );
  input.observedBeetleEntryHolesCounts.forEach((v) =>
    bounded(v, "count", 0, 1000000),
  );
  const known = sum(input.observedAssessedBarkAreaM2),
    unknown = sum(input.observedUnassessedBarkAreaM2);
  return {
    knownPooledEvidenceDensity:
      sum(input.observedBeetleEntryHolesCounts) / known,
    unassessedExposureFraction: unknown / (known + unknown),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBeetleEntryHolesCounts: [2, 6],
  observedAssessedBarkAreaM2: [1, 3],
  observedUnassessedBarkAreaM2: [1, 1],
} satisfies Input;
export const exampleOutput = {
  knownPooledEvidenceDensity: 2,
  unassessedExposureFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/bark-beetle-entry-hole-density-per-square-meter",
  title: "Bark Beetle Entry Hole Density /m² Counter",
  description:
    "Pool actual BeetleEntryHoles counts against assessed BarkAreaM2 with unavailable coverage, not whole-tree count, inferred organism identity or unobserved density. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownPooledEvidenceDensity",
      label: "Known pooled evidence density",
      kind: "number",
    },
    {
      id: "unassessedExposureFraction",
      label: "Unassessed exposure fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBeetleEntryHolesCounts:
        value.observedBeetleEntryHolesCounts as readonly number[],
      observedAssessedBarkAreaM2:
        value.observedAssessedBarkAreaM2 as readonly number[],
      observedUnassessedBarkAreaM2:
        value.observedUnassessedBarkAreaM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
