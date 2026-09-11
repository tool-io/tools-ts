import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedFullWrapCountsByRope: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedFullWrapCountsByRope",
    label: "Independently recorded full wrap counts by rope",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyRecordedFullWrapCountsByRope.length)
    simpleError("wraps", "Actual nonempty inventory.");
  input.independentlyRecordedFullWrapCountsByRope.forEach((v) =>
    bounded(v, "wraps", 0, 1000000),
  );
  return {
    observedFullWrapCountTotal: sum(
      input.independentlyRecordedFullWrapCountsByRope,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyRecordedFullWrapCountsByRope: [3, 4] },
  output: { result: { observedFullWrapCountTotal: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/wire-rope-drum-groove-wrap-count",
  title: "Wire Rope Drum Groove Wrap Count Tool",
  description:
    "Actual observed full-wrap inventory sum, not required minimum, drum/groove suitability, remaining-rope engagement or safe winding instructions.",
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
