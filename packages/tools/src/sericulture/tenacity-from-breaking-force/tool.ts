import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly breakingForcesNewtons: readonly number[];
  readonly linearDensitiesTex: readonly number[];
  readonly callerMinimumTenacityCnPerTex: number;
}>;
export type Output = Readonly<{
  readonly tenacitiesCnPerTex: readonly number[];
  readonly meanTenacityCnPerTex: number;
  readonly belowCallerMinimumFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "breakingForcesNewtons",
    label: "Breaking forces newtons",
    kind: "numberList",
  },
  {
    id: "linearDensitiesTex",
    label: "Linear densities tex",
    kind: "numberList",
  },
  {
    id: "callerMinimumTenacityCnPerTex",
    label: "Caller minimum tenacity cn per tex",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.linearDensitiesTex.forEach((v) => positive(v, "linearDensitiesTex"));
  input.breakingForcesNewtons.forEach((v) =>
    nonnegative(v, "breakingForcesNewtons"),
  );
  nonnegative(
    input.callerMinimumTenacityCnPerTex,
    "callerMinimumTenacityCnPerTex",
  );
  aligned(
    input.breakingForcesNewtons,
    input.linearDensitiesTex,
    "breakingForcesNewtons",
  );
  const tenacitiesCnPerTex = input.breakingForcesNewtons.map(
    (v, i) => (v * 100) / input.linearDensitiesTex[i],
  );
  return {
    tenacitiesCnPerTex,
    meanTenacityCnPerTex: mean(tenacitiesCnPerTex),
    belowCallerMinimumFlags: tenacitiesCnPerTex.map((v) =>
      v < input.callerMinimumTenacityCnPerTex ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  breakingForcesNewtons: [1, 2],
  linearDensitiesTex: [10, 10],
  callerMinimumTenacityCnPerTex: 15,
} satisfies Input;
export const exampleOutput = {
  tenacitiesCnPerTex: [10, 20],
  meanTenacityCnPerTex: 15,
  belowCallerMinimumFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/tenacity-from-breaking-force",
  title: "Tenacity From Breaking Force",
  description:
    "Normalize matched yarn breaking force to cN/tex and audit a caller threshold; force is not fabric strength and method conditioning is external.",
  inputs: inputFields,
  outputs: [
    {
      id: "tenacitiesCnPerTex",
      label: "Tenacities cn per tex",
      kind: "numberList",
    },
    {
      id: "meanTenacityCnPerTex",
      label: "Mean tenacity cn per tex",
      kind: "number",
    },
    {
      id: "belowCallerMinimumFlags",
      label: "Below caller minimum flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      breakingForcesNewtons: value.breakingForcesNewtons as readonly number[],
      linearDensitiesTex: value.linearDensitiesTex as readonly number[],
      callerMinimumTenacityCnPerTex:
        value.callerMinimumTenacityCnPerTex as number,
    }),
});
export const run = tool.execute;
export default tool;
