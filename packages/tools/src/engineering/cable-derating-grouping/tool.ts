import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBaseAmpacityAmps: number;
  readonly callerApplicableGroupingFactor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedBaseAmpacityAmps",
    label: "Caller verified base ampacity amps",
    kind: "number",
  },
  {
    id: "callerApplicableGroupingFactor",
    label: "Caller applicable grouping factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVerifiedBaseAmpacityAmps,
    "callerVerifiedBaseAmpacityAmps",
  );
  fraction(
    input.callerApplicableGroupingFactor,
    "callerApplicableGroupingFactor",
  );
  return {
    value:
      input.callerVerifiedBaseAmpacityAmps *
      input.callerApplicableGroupingFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedBaseAmpacityAmps: 100,
    callerApplicableGroupingFactor: 0.5,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/cable-derating-grouping",
  title: "Cable Grouping Derating Calculator",
  description:
    "Actual independently verified baseampacity\u00d7applicable grouping factor, not fabricated cable table or inferred code capacity. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
