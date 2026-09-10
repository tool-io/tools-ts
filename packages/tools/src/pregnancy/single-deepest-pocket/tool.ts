import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  nonnegative,
  unique,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerQualifiedPocketIds: readonly string[];
  readonly independentlyMeasuredPocketDepthsCm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerQualifiedPocketIds",
    label: "Caller qualified pocket ids",
    kind: "stringList",
  },
  {
    id: "independentlyMeasuredPocketDepthsCm",
    label: "Independently measured pocket depths cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerQualifiedPocketIds, "pockets");
  aligned(
    input.callerQualifiedPocketIds,
    input.independentlyMeasuredPocketDepthsCm,
    "depths",
  );
  input.independentlyMeasuredPocketDepthsCm.forEach((v) =>
    nonnegative(v, "depth"),
  );
  const m = Math.max(...input.independentlyMeasuredPocketDepthsCm);
  return {
    observedDeepestQualifiedPocketDepthCm: m,
    deepestQualifiedPocketIds: input.callerQualifiedPocketIds.filter(
      (_, i) => input.independentlyMeasuredPocketDepthsCm[i] === m,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerQualifiedPocketIds: ["a", "b", "c"],
    independentlyMeasuredPocketDepthsCm: [2, 4, 4],
  },
  output: {
    result: {
      observedDeepestQualifiedPocketDepthCm: 4,
      deepestQualifiedPocketIds: ["b", "c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/single-deepest-pocket",
  title: "Single Deepest Pocket Calculator",
  description:
    "Find all largest actual independently qualified amniotic-fluid pocket depths. Qualification, probe geometry and cord/fetal exclusion caller clinical responsibilities; no fluid-volume inference or diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
