import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerNormalizedHealthIndex: number;
  readonly callerNormalizedEducationIndex: number;
  readonly callerNormalizedIncomeIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerNormalizedHealthIndex",
    label: "Caller normalized health index",
    kind: "number",
  },
  {
    id: "callerNormalizedEducationIndex",
    label: "Caller normalized education index",
    kind: "number",
  },
  {
    id: "callerNormalizedIncomeIndex",
    label: "Caller normalized income index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerNormalizedHealthIndex,
    input.callerNormalizedEducationIndex,
    input.callerNormalizedIncomeIndex,
  ].forEach((v) => fraction(v, "component"));
  return {
    conditionalHdi: Math.cbrt(
      input.callerNormalizedHealthIndex *
        input.callerNormalizedEducationIndex *
        input.callerNormalizedIncomeIndex,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerNormalizedHealthIndex: 0.5,
    callerNormalizedEducationIndex: 0.5,
    callerNormalizedIncomeIndex: 0.5,
  },
  output: { result: { conditionalHdi: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/human-development-index",
  title: "Human Development Index Calculator",
  description:
    "Conditional geometric HDIaggregate of independently established compatible normalized components. No current country values, goalpost authority or causal welfare inference.",
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
