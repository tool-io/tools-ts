import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly crestWidthM: number;
  readonly upstreamHeadM: number;
  readonly gravityMSecond2: number;
  readonly callerDischargeCoefficient: number;
}>;
export type Output = Readonly<{
  readonly broadCrestedDischargeM3Second: number;
}>;
const inputFields = [
  { id: "crestWidthM", label: "Crest width m", kind: "number" },
  { id: "upstreamHeadM", label: "Upstream head m", kind: "number" },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
  {
    id: "callerDischargeCoefficient",
    label: "Caller discharge coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.crestWidthM, "crestWidthM");
  positive(input.gravityMSecond2, "gravityMSecond2");
  positive(input.callerDischargeCoefficient, "callerDischargeCoefficient");
  nonnegative(input.upstreamHeadM, "upstreamHeadM");
  return {
    broadCrestedDischargeM3Second:
      input.callerDischargeCoefficient *
      input.crestWidthM *
      Math.sqrt(input.gravityMSecond2) *
      ((2 * input.upstreamHeadM) / 3) ** 1.5,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crestWidthM: 2,
  upstreamHeadM: 3,
  gravityMSecond2: 9,
  callerDischargeCoefficient: 1,
} satisfies Input;
export const exampleOutput = {
  broadCrestedDischargeM3Second: 16.970562748477143,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/weir-broad-crested-flow",
  title: "Broad-Crested Weir Flow Calculator",
  description:
    "Ideal free-flow broad-crested critical control Q=Cd b√g(2H/3)^1.5, head includes caller approach convention. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "broadCrestedDischargeM3Second",
      label: "Broad crested discharge m3 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crestWidthM: value.crestWidthM as number,
      upstreamHeadM: value.upstreamHeadM as number,
      gravityMSecond2: value.gravityMSecond2 as number,
      callerDischargeCoefficient: value.callerDischargeCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
