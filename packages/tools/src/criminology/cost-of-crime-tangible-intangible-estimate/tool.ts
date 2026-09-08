import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, sumMoney } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly verifiedTangibleLossesMinor: readonly number[];
  readonly independentlyCalibratedIntangibleScenarioValuesMinor: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedTangibleLossesMinor",
    label: "Verified tangible losses minor",
    kind: "numberList",
  },
  {
    id: "independentlyCalibratedIntangibleScenarioValuesMinor",
    label: "Independently calibrated intangible scenario values minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.verifiedTangibleLossesMinor,
    input.independentlyCalibratedIntangibleScenarioValuesMinor,
    "incidents",
  );
  return {
    conditionalScenarioCostMinor: sumMoney([
      ...input.verifiedTangibleLossesMinor,
      ...input.independentlyCalibratedIntangibleScenarioValuesMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedTangibleLossesMinor: [100, 200],
    independentlyCalibratedIntangibleScenarioValuesMinor: [50, 50],
  },
  output: { result: { conditionalScenarioCostMinor: 400 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/cost-of-crime-tangible-intangible-estimate",
  title: "Cost Of Crime Tangible Intangible Estimate Calculator",
  description:
    "Reconcile actual distinct incident loss and independently calibrated intangible scenario valuation. Exact one-currency minor units, no double-counting or causality inferred; not objective price of suffering or compensation entitlement.",
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
