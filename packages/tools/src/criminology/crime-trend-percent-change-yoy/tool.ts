import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly previousMatchedRecordedCount: number;
  readonly currentMatchedRecordedCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "previousMatchedRecordedCount",
    label: "Previous matched recorded count",
    kind: "number",
  },
  {
    id: "currentMatchedRecordedCount",
    label: "Current matched recorded count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.previousMatchedRecordedCount, "previous");
  nonnegative(input.currentMatchedRecordedCount, "current");
  return {
    signedRecordedChangePercent:
      (100 *
        (input.currentMatchedRecordedCount -
          input.previousMatchedRecordedCount)) /
      input.previousMatchedRecordedCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { previousMatchedRecordedCount: 100, currentMatchedRecordedCount: 80 },
  output: { result: { signedRecordedChangePercent: -20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/crime-trend-percent-change-yoy",
  title: "Crime Trend Percent Change YoY Calculator",
  description:
    "Matched same-period year-on-year recorded-event change. Classification/coverage changes independently reconciled; zero prior count undefined, not crime incidence or causal policy effect.",
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
