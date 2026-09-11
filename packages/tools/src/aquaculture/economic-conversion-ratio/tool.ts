import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  money,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFeedCostMinorUnits: number;
  readonly actualMeasuredWetBiomassGainKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFeedCostMinorUnits",
    label: "Actual feed cost minor units",
    kind: "number",
  },
  {
    id: "actualMeasuredWetBiomassGainKg",
    label: "Actual measured wet biomass gain kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualFeedCostMinorUnits, "actualFeedCostMinorUnits");
  positive(
    input.actualMeasuredWetBiomassGainKg,
    "actualMeasuredWetBiomassGainKg",
  );
  money(input.actualFeedCostMinorUnits, "feedcost");
  return {
    value:
      input.actualFeedCostMinorUnits / input.actualMeasuredWetBiomassGainKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFeedCostMinorUnits: 10, actualMeasuredWetBiomassGainKg: 2 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/economic-conversion-ratio",
  title: "Economic Conversion Ratio Calculator",
  description:
    "Observed ECONOMIC conversion feed cost minor units perwetgainkg, not food mass efficiency or total profit. Actual one currency/feed ledger and independently matched gain.",
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
