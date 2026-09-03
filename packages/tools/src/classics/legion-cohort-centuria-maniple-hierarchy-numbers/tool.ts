import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sum,
  exactProduct,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerCenturiaePerCohort: readonly number[];
  readonly callerSoldiersPerCenturia: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCenturiaePerCohort",
    label: "Caller centuriae per cohort",
    kind: "numberList",
  },
  {
    id: "callerSoldiersPerCenturia",
    label: "Caller soldiers per centuria",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.callerCenturiaePerCohort.forEach((v) =>
    bounded(v, "centuriae", 1, 128),
  );
  bounded(input.callerSoldiersPerCenturia, "soldiers", 1, 10000);
  return {
    totalCenturiae: sum(input.callerCenturiaePerCohort),
    nominalSoldierCapacity: exactProduct(
      sum(input.callerCenturiaePerCohort),
      input.callerSoldiersPerCenturia,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerCenturiaePerCohort: [6, 6, 6], callerSoldiersPerCenturia: 80 },
  output: { result: { totalCenturiae: 18, nominalSoldierCapacity: 1440 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/legion-cohort-centuria-maniple-hierarchy-numbers",
  title: "Legion Cohort Centuria Maniple Hierarchy Numbers",
  description:
    "Aggregate independently specified era/unit legion-cohort-centuria model, not universal century of 100or complete historical legion strength; excludes officers and attachments unless caller includes them.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
