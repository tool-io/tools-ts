import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  aligned,
  sourceFor,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualCandidateValues: readonly string[];
  readonly callerActualNonnegativeWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "actualCandidateValues",
    label: "Actual candidate values",
    kind: "stringList",
  },
  {
    id: "callerActualNonnegativeWeights",
    label: "Caller actual nonnegative weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  aligned(
    input.actualCandidateValues,
    input.callerActualNonnegativeWeights,
    "weights",
  );
  input.callerActualNonnegativeWeights.forEach((v) => nonnegative(v, "weight"));
  const t = positive(sum(input.callerActualNonnegativeWeights), "totalweight"),
    x = random() * t;
  let s = 0;
  for (let i = 0; i < input.actualCandidateValues.length; i++) {
    s += input.callerActualNonnegativeWeights[i];
    if (x < s) return { selectedValue: input.actualCandidateValues[i] };
  }
  return {
    selectedValue:
      input.actualCandidateValues[
        input.callerActualNonnegativeWeights.length -
          1 -
          [...input.callerActualNonnegativeWeights]
            .reverse()
            .findIndex((v) => v > 0)
      ],
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    seed: "batch51",
    actualCandidateValues: ["a", "b"],
    callerActualNonnegativeWeights: [1, 3],
  },
  output: {
    result: {
      selectedValue: "b",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/weighted-item",
  title: "Weighted Random Item Picker",
  description:
    "Actualweightedcategoricaldrawoneadvancingsource,weightsnonnegativefinitepositive sum,zeroweightpositionsneverselected. Candidatepositionsnotnecessarilydistinctvalues;not secure randomness.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
