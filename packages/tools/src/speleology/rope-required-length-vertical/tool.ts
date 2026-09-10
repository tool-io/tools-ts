import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualVerticalRiggingSegmentsMeters: readonly number[];
  readonly callerIndependentAllowanceLengthsMeters: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualVerticalRiggingSegmentsMeters",
    label: "Actual vertical rigging segments meters",
    kind: "numberList",
  },
  {
    id: "callerIndependentAllowanceLengthsMeters",
    label: "Caller independent allowance lengths meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualVerticalRiggingSegmentsMeters,
    input.callerIndependentAllowanceLengthsMeters,
  ].forEach((v) => {
    if (!v.length)
      simpleError("inventory", "Actual explicit segment/allowanceinventory.");
    v.forEach((x) => nonnegative(x, "length"));
  });
  return {
    conditionalInventoryRopeLengthMeters:
      sum(input.actualVerticalRiggingSegmentsMeters) +
      sum(input.callerIndependentAllowanceLengthsMeters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualVerticalRiggingSegmentsMeters: [2, 3],
    callerIndependentAllowanceLengthsMeters: [1, 2],
  },
  output: { result: { conditionalInventoryRopeLengthMeters: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/rope-required-length-vertical",
  title: "Vertical Rope Required Length Calculator",
  description:
    "actual independently designed vertical rigging path plus caller-required separate allowances. Same meters; actual knots/end tails, load, fixed rigging and usable length independently assessed. No rope selection, round-up, safe-rigging approval or universally sufficient length.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
