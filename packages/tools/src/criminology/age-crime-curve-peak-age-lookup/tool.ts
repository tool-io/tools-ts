import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerAgeBandIds: readonly string[];
  readonly independentlyMatchedObservedRates: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerAgeBandIds", label: "Caller age band ids", kind: "stringList" },
  {
    id: "independentlyMatchedObservedRates",
    label: "Independently matched observed rates",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerAgeBandIds, "bands");
  aligned(
    input.callerAgeBandIds,
    input.independentlyMatchedObservedRates,
    "rates",
  );
  input.independentlyMatchedObservedRates.forEach((v) =>
    nonnegative(v, "rate"),
  );
  const m = Math.max(...input.independentlyMatchedObservedRates);
  return {
    maximumObservedAgeBandIds: input.callerAgeBandIds.filter(
      (_, i) => input.independentlyMatchedObservedRates[i] === m,
    ),
    maximumObservedRate: m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerAgeBandIds: ["a", "b", "c"],
    independentlyMatchedObservedRates: [1, 3, 3],
  },
  output: {
    result: { maximumObservedAgeBandIds: ["b", "c"], maximumObservedRate: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/age-crime-curve-peak-age-lookup",
  title: "Age Crime Curve Peak Age Lookup",
  description:
    "Find all actual matched rate maxima in independently defined age bins, not universal peak age or a prediction of individual behavior. Bin IDsand ties retained.",
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
