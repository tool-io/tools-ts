import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDissolvedInletCalciumMoles: number;
  readonly actualDissolvedOutletCalciumMoles: number;
  readonly callerVerifiedCalciteMolarMassGramsPerMole: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDissolvedInletCalciumMoles",
    label: "Actual dissolved inlet calcium moles",
    kind: "number",
  },
  {
    id: "actualDissolvedOutletCalciumMoles",
    label: "Actual dissolved outlet calcium moles",
    kind: "number",
  },
  {
    id: "callerVerifiedCalciteMolarMassGramsPerMole",
    label: "Caller verified calcite molar mass grams per mole",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualDissolvedInletCalciumMoles, "inlet");
  nonnegative(input.actualDissolvedOutletCalciumMoles, "outlet");
  positive(input.callerVerifiedCalciteMolarMassGramsPerMole, "molar-mass");
  return {
    signedConditionalCalciteDepositedMassGrams:
      (input.actualDissolvedInletCalciumMoles -
        input.actualDissolvedOutletCalciumMoles) *
      input.callerVerifiedCalciteMolarMassGramsPerMole,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDissolvedInletCalciumMoles: 5,
    actualDissolvedOutletCalciumMoles: 3,
    callerVerifiedCalciteMolarMassGramsPerMole: 100,
  },
  output: { result: { signedConditionalCalciteDepositedMassGrams: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/calcite-mass-balance",
  title: "Calcite Precipitation Mass Balance Calculator",
  description:
    "Actual dissolved calcium mole difference\u00d7verified CaCO3molar mass under independent one-Ca/one-calcite exclusive sink bookkeeping. Negative means net release; no infer mineral deposition if other sinks/sources occur.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
