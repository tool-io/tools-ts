import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedGniPerCapita: number;
  readonly callerApplicableMinimumGni: number;
  readonly callerApplicableMaximumGni: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedGniPerCapita",
    label: "Observed gni per capita",
    kind: "number",
  },
  {
    id: "callerApplicableMinimumGni",
    label: "Caller applicable minimum gni",
    kind: "number",
  },
  {
    id: "callerApplicableMaximumGni",
    label: "Caller applicable maximum gni",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedGniPerCapita, "GNI");
  positive(input.callerApplicableMinimumGni, "minimum");
  if (input.callerApplicableMaximumGni <= input.callerApplicableMinimumGni)
    simpleError("goalposts", "Ordered positive GNIgoalposts.");
  return {
    conditionalIncomeIndex:
      Math.log(input.observedGniPerCapita / input.callerApplicableMinimumGni) /
      Math.log(
        input.callerApplicableMaximumGni / input.callerApplicableMinimumGni,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedGniPerCapita: 1000,
    callerApplicableMinimumGni: 100,
    callerApplicableMaximumGni: 10000,
  },
  output: { result: { conditionalIncomeIndex: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/income-index",
  title: "Income Index Calculator",
  description:
    "Log income-index normalization under independently applicable same-unit/PPP/year GNIgoalposts; unclipped extrapolation explicitly retained, not market-income equivalence or published index.",
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
