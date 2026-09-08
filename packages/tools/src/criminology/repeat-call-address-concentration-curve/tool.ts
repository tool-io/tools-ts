import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerAddressIds: readonly string[];
  readonly independentlyRecordedCallCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerAddressIds", label: "Caller address ids", kind: "stringList" },
  {
    id: "independentlyRecordedCallCounts",
    label: "Independently recorded call counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerAddressIds, "addresses");
  aligned(
    input.callerAddressIds,
    input.independentlyRecordedCallCounts,
    "counts",
  );
  input.independentlyRecordedCallCounts.forEach((v) => nonnegative(v, "calls"));
  const t = positive(sum(input.independentlyRecordedCallCounts), "calls"),
    order = input.callerAddressIds
      .map((_, i) => i)
      .sort(
        (a, b) =>
          input.independentlyRecordedCallCounts[b] -
            input.independentlyRecordedCallCounts[a] || a - b,
      );
  let c = 0;
  return {
    descendingCallerAddressIds: order.map((i) => input.callerAddressIds[i]),
    cumulativeAddressFractions: order.map((_, i) => (i + 1) / order.length),
    cumulativeObservedCallFractions: order.map(
      (i) => (c += input.independentlyRecordedCallCounts[i]) / t,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerAddressIds: ["a", "b", "c"],
    independentlyRecordedCallCounts: [1, 3, 2],
  },
  output: {
    result: {
      descendingCallerAddressIds: ["b", "c", "a"],
      cumulativeAddressFractions: [0.3333333333333333, 0.6666666666666666, 1],
      cumulativeObservedCallFractions: [0.5, 0.8333333333333334, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/repeat-call-address-concentration-curve",
  title: "Repeat Call Address Concentration Curve Tool",
  description:
    "Actual repeat-call concentration curve by independently grouped pseudonymous address IDs, stable input-order ties. Calls do not establish crimes, individual identity or permission to target a location.",
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
