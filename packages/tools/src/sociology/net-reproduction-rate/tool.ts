import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAsfrPer1000: readonly number[];
  readonly ageBandWidthsYears: readonly number[];
  readonly femaleBirthFractions: readonly number[];
  readonly survivalToAgeFractions: readonly number[];
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
  {
    id: "femaleBirthFractions",
    label: "Female birth fractions",
    kind: "numberList",
  },
  {
    id: "survivalToAgeFractions",
    label: "Survival to age fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(input.observedAsfrPer1000, input.ageBandWidthsYears, "bands");
  input.observedAsfrPer1000.forEach((v) => nonnegative(v, "ASFR"));
  input.ageBandWidthsYears.forEach((v) => positive(v, "width"));
  aligned(
    input.femaleBirthFractions,
    input.observedAsfrPer1000,
    "femaleBirthFractions",
  );
  input.femaleBirthFractions.forEach((v) => fraction(v, "fraction"));
  aligned(
    input.survivalToAgeFractions,
    input.observedAsfrPer1000,
    "survivalToAgeFractions",
  );
  input.survivalToAgeFractions.forEach((v) => fraction(v, "fraction"));
  return {
    conditionalLifetimeBirths:
      sum(
        input.observedAsfrPer1000.map(
          (v, i) =>
            v *
            input.ageBandWidthsYears[i] *
            input.femaleBirthFractions[i] *
            input.survivalToAgeFractions[i],
        ),
      ) / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedAsfrPer1000: [100, 200],
    ageBandWidthsYears: [5, 5],
    femaleBirthFractions: [0.5, 0.5],
    survivalToAgeFractions: [0.5, 0.5],
  },
  output: { result: { conditionalLifetimeBirths: 0.375 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/net-reproduction-rate",
  title: "Net Reproduction Rate Calculator",
  description:
    "Net reproduction from actual ASFRschedule with independent female-birth/survival fractions, not a universal replacement threshold. Caller supplies complete nonoverlapping relevant age bands and matching definitions; no observed individual lifetime prediction.",
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
