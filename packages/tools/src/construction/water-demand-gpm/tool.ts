import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyQualifiedSimultaneousFixtureDemandGpm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyQualifiedSimultaneousFixtureDemandGpm",
    label: "Caller independently qualified simultaneous fixture demand gpm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.callerIndependentlyQualifiedSimultaneousFixtureDemandGpm.length)
    simpleError(
      "callerIndependentlyQualifiedSimultaneousFixtureDemandGpm",
      "Actual nonempty observations.",
    );
  input.callerIndependentlyQualifiedSimultaneousFixtureDemandGpm.forEach((v) =>
    nonnegative(v, "callerIndependentlyQualifiedSimultaneousFixtureDemandGpm"),
  );
  return {
    value: sum(input.callerIndependentlyQualifiedSimultaneousFixtureDemandGpm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerIndependentlyQualifiedSimultaneousFixtureDemandGpm: [2, 4] },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/water-demand-gpm",
  title: "Water Demand GPM Calculator",
  description:
    "Actual independently qualified coincident fixture demand GPM sum, not Hunter fixture-unit curve or municipalL/person/day. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
