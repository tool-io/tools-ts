import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, crossing } from "../shared.js";
export type Input = Readonly<{
  readonly enamelFormationAgesYears: readonly number[];
  readonly delta15NValues: readonly number[];
  readonly postWeaningReferenceDelta15N: number;
  readonly callerResidualEnrichmentCriterion: number;
}>;
export type Output = Readonly<{
  readonly modelIsotopicTransitionAgeYears: number;
}>;
const inputFields = [
  {
    id: "enamelFormationAgesYears",
    label: "Enamel formation ages years",
    kind: "numberList",
  },
  { id: "delta15NValues", label: "Delta15 n values", kind: "numberList" },
  {
    id: "postWeaningReferenceDelta15N",
    label: "Post weaning reference delta15 n",
    kind: "number",
  },
  {
    id: "callerResidualEnrichmentCriterion",
    label: "Caller residual enrichment criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.enamelFormationAgesYears.forEach((v) =>
    nonnegative(v, "enamelFormationAgesYears"),
  );
  nonnegative(
    input.callerResidualEnrichmentCriterion,
    "callerResidualEnrichmentCriterion",
  );
  const modelIsotopicTransitionAgeYears = crossing(
    input.enamelFormationAgesYears,
    input.delta15NValues.map((v) => v - input.postWeaningReferenceDelta15N),
    input.callerResidualEnrichmentCriterion,
  );
  return { modelIsotopicTransitionAgeYears };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  enamelFormationAgesYears: [0, 1, 2, 3],
  delta15NValues: [10, 9, 7, 6],
  postWeaningReferenceDelta15N: 6,
  callerResidualEnrichmentCriterion: 2,
} satisfies Input;
export const exampleOutput = {
  modelIsotopicTransitionAgeYears: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/isotopic-weaning-age-enamel",
  title: "Isotopic Weaning Age Enamel",
  description:
    "Locate a unique caller isotopic-enrichment transition on supplied enamel formation ages, excluding enamel maturation lag/other diet effects; proxy timing is not a confirmed age at cessation of breastfeeding.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelIsotopicTransitionAgeYears",
      label: "Model isotopic transition age years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      enamelFormationAgesYears:
        value.enamelFormationAgesYears as readonly number[],
      delta15NValues: value.delta15NValues as readonly number[],
      postWeaningReferenceDelta15N:
        value.postWeaningReferenceDelta15N as number,
      callerResidualEnrichmentCriterion:
        value.callerResidualEnrichmentCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
