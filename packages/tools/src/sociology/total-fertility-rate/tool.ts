import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAsfrPer1000: readonly number[];
  readonly ageBandWidthsYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedAsfrPer1000",
    label: "Observed asfr per1000",
    kind: "numberList",
  },
  {
    id: "ageBandWidthsYears",
    label: "Age band widths years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(input.observedAsfrPer1000, input.ageBandWidthsYears, "bands");
  input.observedAsfrPer1000.forEach((v) => nonnegative(v, "ASFR"));
  input.ageBandWidthsYears.forEach((v) => positive(v, "width"));
  return {
    conditionalLifetimeBirths:
      sum(
        input.observedAsfrPer1000.map(
          (v, i) => v * input.ageBandWidthsYears[i],
        ),
      ) / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedAsfrPer1000: [100, 200], ageBandWidthsYears: [5, 5] },
  output: { result: { conditionalLifetimeBirths: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/total-fertility-rate",
  title: "Total Fertility Rate Calculator",
  description:
    "Period total fertility from actual ASFRschedule, not completed cohort fertility. Caller supplies complete nonoverlapping relevant age bands and matching definitions; no observed individual lifetime prediction.",
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
