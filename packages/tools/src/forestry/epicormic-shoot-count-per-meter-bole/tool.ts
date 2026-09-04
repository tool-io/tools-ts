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
  readonly observedEpicormicShootsCounts: readonly number[];
  readonly observedAssessedBoleLengthM: readonly number[];
  readonly observedUnassessedBoleLengthM: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownPooledEvidenceDensity: number;
  readonly unassessedExposureFraction: number;
}>;
const inputFields = [
  {
    id: "observedEpicormicShootsCounts",
    label: "Observed epicormic shoots counts",
    kind: "numberList",
  },
  {
    id: "observedAssessedBoleLengthM",
    label: "Observed assessed bole length m",
    kind: "numberList",
  },
  {
    id: "observedUnassessedBoleLengthM",
    label: "Observed unassessed bole length m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAssessedBoleLengthM.forEach((v) =>
    positive(v, "observedAssessedBoleLengthM"),
  );
  input.observedUnassessedBoleLengthM.forEach((v) =>
    nonnegative(v, "observedUnassessedBoleLengthM"),
  );
  aligned(
    input.observedEpicormicShootsCounts,
    input.observedAssessedBoleLengthM,
    "observedEpicormicShootsCounts",
  );
  aligned(
    input.observedEpicormicShootsCounts,
    input.observedUnassessedBoleLengthM,
    "observedEpicormicShootsCounts",
  );
  input.observedEpicormicShootsCounts.forEach((v) =>
    bounded(v, "count", 0, 1000000),
  );
  const known = sum(input.observedAssessedBoleLengthM),
    unknown = sum(input.observedUnassessedBoleLengthM);
  return {
    knownPooledEvidenceDensity:
      sum(input.observedEpicormicShootsCounts) / known,
    unassessedExposureFraction: unknown / (known + unknown),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEpicormicShootsCounts: [2, 6],
  observedAssessedBoleLengthM: [1, 3],
  observedUnassessedBoleLengthM: [1, 1],
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
  id: "forestry/epicormic-shoot-count-per-meter-bole",
  title: "Epicormic Shoots Per Meter Bole Counter",
  description:
    "Pool actual EpicormicShoots counts against assessed BoleLengthM with unavailable coverage, not whole-tree count, inferred organism identity or unobserved density. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedEpicormicShootsCounts:
        value.observedEpicormicShootsCounts as readonly number[],
      observedAssessedBoleLengthM:
        value.observedAssessedBoleLengthM as readonly number[],
      observedUnassessedBoleLengthM:
        value.observedUnassessedBoleLengthM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
