import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerNormalizedMeanSchoolingIndex: number;
  readonly callerNormalizedExpectedSchoolingIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerNormalizedMeanSchoolingIndex",
    label: "Caller normalized mean schooling index",
    kind: "number",
  },
  {
    id: "callerNormalizedExpectedSchoolingIndex",
    label: "Caller normalized expected schooling index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.callerNormalizedMeanSchoolingIndex, "index");
  fraction(input.callerNormalizedExpectedSchoolingIndex, "index");
  return {
    conditionalEducationIndex:
      (input.callerNormalizedMeanSchoolingIndex +
        input.callerNormalizedExpectedSchoolingIndex) /
      2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerNormalizedMeanSchoolingIndex: 0.6,
    callerNormalizedExpectedSchoolingIndex: 0.8,
  },
  output: { result: { conditionalEducationIndex: 0.7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/education-index",
  title: "Education Index Calculator",
  description:
    "Conditional arithmetic education-index component from independently normalized mean/expected schooling indices under caller verified edition goalposts. No built-in UNDPgoalposts or attainment data.",
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
