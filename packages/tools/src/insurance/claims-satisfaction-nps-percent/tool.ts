import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly independentlyCollectedZeroToTenResponses: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCollectedZeroToTenResponses",
    label: "Independently collected zero to ten responses",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyCollectedZeroToTenResponses.length)
    simpleError("responses", "Nonempty actual response cohort.");
  input.independentlyCollectedZeroToTenResponses.forEach((v) =>
    bounded(v, "response", 0, 10),
  );
  const p = input.independentlyCollectedZeroToTenResponses.filter(
      (v) => v >= 9,
    ).length,
    d = input.independentlyCollectedZeroToTenResponses.filter(
      (v) => v <= 6,
    ).length;
  return {
    promoterCount: p,
    passiveCount: input.independentlyCollectedZeroToTenResponses.length - p - d,
    detractorCount: d,
    observedNpsPercentagePoints:
      (100 * (p - d)) / input.independentlyCollectedZeroToTenResponses.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyCollectedZeroToTenResponses: [0, 6, 7, 8, 9, 10] },
  output: {
    result: {
      promoterCount: 2,
      passiveCount: 2,
      detractorCount: 2,
      observedNpsPercentagePoints: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/claims-satisfaction-nps-percent",
  title: "Claims Satisfaction NPS Percent Calculator",
  description:
    "Observed NPS from actual distinct cohort response entries0\u201310:promoters9\u201310, passives7\u20138, detractors0\u20136. Not average satisfaction, claims coverage or representative population inference; caller independently resolves nonresponses/duplicate people.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
