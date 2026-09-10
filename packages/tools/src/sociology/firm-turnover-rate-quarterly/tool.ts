import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedQuarterFirmBirths: number;
  readonly observedQuarterFirmDeaths: number;
  readonly independentlyMatchedMeanFirmCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedQuarterFirmBirths",
    label: "Observed quarter firm births",
    kind: "number",
  },
  {
    id: "observedQuarterFirmDeaths",
    label: "Observed quarter firm deaths",
    kind: "number",
  },
  {
    id: "independentlyMatchedMeanFirmCount",
    label: "Independently matched mean firm count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.observedQuarterFirmBirths, "births");
  nonnegative(input.observedQuarterFirmDeaths, "deaths");
  positive(input.independentlyMatchedMeanFirmCount, "meanfirms");
  return {
    observedGrossFirmTurnoverPercent:
      (100 *
        (input.observedQuarterFirmBirths + input.observedQuarterFirmDeaths)) /
      input.independentlyMatchedMeanFirmCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedQuarterFirmBirths: 2,
    observedQuarterFirmDeaths: 3,
    independentlyMatchedMeanFirmCount: 50,
  },
  output: { result: { observedGrossFirmTurnoverPercent: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/firm-turnover-rate-quarterly",
  title: "Quarterly Firm Turnover Rate Calculator",
  description:
    "Observed gross firm birth+death turnover under actual quarter stock definition, not employee turnover or signed net firm growth.",
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
