import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerEffectiveReachableDegree: number;
  readonly callerPopulationSize: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerEffectiveReachableDegree",
    label: "Caller effective reachable degree",
    kind: "number",
  },
  {
    id: "callerPopulationSize",
    label: "Caller population size",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.callerEffectiveReachableDegree <= 1)
    simpleError("degree", "Effective branching degree>1.");
  positive(input.callerPopulationSize, "population");
  return {
    conditionalTreeLikeHopEstimate:
      Math.log(input.callerPopulationSize) /
      Math.log(input.callerEffectiveReachableDegree),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerEffectiveReachableDegree: 2, callerPopulationSize: 64 },
  output: { result: { conditionalTreeLikeHopEstimate: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/six-degrees-hop-estimate-small-world",
  title: "Six-Degrees Hop Small-World Estimator",
  description:
    "Conditional log(N)/log(k) tree-like branching estimate under caller effective degree, not shortest-path census, six-degree law or actual small-world guarantee.",
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
