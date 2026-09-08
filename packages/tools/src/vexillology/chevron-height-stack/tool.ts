import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly stackExtent: number;
  readonly callerChevronAxialDepths: readonly number[];
  readonly callerGaps: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "stackExtent", label: "Stack extent", kind: "number" },
  {
    id: "callerChevronAxialDepths",
    label: "Caller chevron axial depths",
    kind: "numberList",
  },
  { id: "callerGaps", label: "Caller gaps", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.stackExtent, "stackExtent");
  input.callerChevronAxialDepths.forEach((v) =>
    nonnegative(v, "callerChevronAxialDepths"),
  );
  input.callerGaps.forEach((v) => nonnegative(v, "callerGaps"));
  if (
    !input.callerChevronAxialDepths.length ||
    input.callerGaps.length !== input.callerChevronAxialDepths.length - 1
  )
    simpleError("stack", "One gap per adjacent pair.");
  const used = sum(input.callerChevronAxialDepths) + sum(input.callerGaps);
  return {
    stackUsedExtent: used,
    signedRemainingExtent: input.stackExtent - used,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    stackExtent: 100,
    callerChevronAxialDepths: [20, 30],
    callerGaps: [10],
  },
  output: { result: { stackUsedExtent: 60, signedRemainingExtent: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/chevron-height-stack",
  title: "Chevron Height Stack Calculator",
  description:
    "Audit actual chevron axial-depth stack plus internal gaps against explicit envelope, retaining negative shortfall; no inferred angles or clipping.",
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
