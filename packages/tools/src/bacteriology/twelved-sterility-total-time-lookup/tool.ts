import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly callerValidatedDecimalReductionMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerValidatedDecimalReductionMinutes",
    label: "Caller validated decimal reduction minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.callerValidatedDecimalReductionMinutes, "D");
  return {
    conditionalTwelveDMinutes: 12 * i.callerValidatedDecimalReductionMinutes,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { callerValidatedDecimalReductionMinutes: 2 },
  output: { result: { conditionalTwelveDMinutes: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/twelved-sterility-total-time-lookup",
  title: "12-D Sterility Standard Lethality Total Time Lookup",
  description:
    "Conditional 12-D hold arithmetic from independently validated constant-temperature D value; does not establish commercial sterility, full lethality or process safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
