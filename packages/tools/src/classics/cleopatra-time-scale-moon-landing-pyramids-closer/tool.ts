import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly cleopatraDeathYearBce: number;
  readonly callerPyramidReferenceYearBce: number;
  readonly moonLandingYearCe: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "cleopatraDeathYearBce",
    label: "Cleopatra death year bce",
    kind: "number",
  },
  {
    id: "callerPyramidReferenceYearBce",
    label: "Caller pyramid reference year bce",
    kind: "number",
  },
  { id: "moonLandingYearCe", label: "Moon landing year ce", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.cleopatraDeathYearBce, "death", 1, 9999);
  bounded(
    input.callerPyramidReferenceYearBce,
    "pyramid",
    input.cleopatraDeathYearBce,
    9999,
  );
  bounded(input.moonLandingYearCe, "moon", 1, 9999);
  const p = input.callerPyramidReferenceYearBce - input.cleopatraDeathYearBce,
    m = input.moonLandingYearCe + input.cleopatraDeathYearBce - 1;
  return {
    yearLabelDistanceToPyramid: p,
    yearLabelDistanceToMoonLanding: m,
    nearerYearLabelEvent: p === m ? "tie" : p < m ? "pyramid" : "moon-landing",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    cleopatraDeathYearBce: 30,
    callerPyramidReferenceYearBce: 2560,
    moonLandingYearCe: 1969,
  },
  output: {
    result: {
      yearLabelDistanceToPyramid: 2530,
      yearLabelDistanceToMoonLanding: 1998,
      nearerYearLabelEvent: "moon-landing",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/cleopatra-time-scale-moon-landing-pyramids-closer",
  title: "Cleopatra Time Scale Moon Landing Pyramids Closer",
  description:
    "Compare independently chosen nominal event years with no civil year zero; pyramid date is uncertain and year-label differences are not exact elapsed anniversary intervals.",
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
