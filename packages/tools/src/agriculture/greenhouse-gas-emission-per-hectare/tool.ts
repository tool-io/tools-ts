import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAttributableCo2EquivalentKg: readonly number[];
  readonly actualMatchedInventoryAreaHectares: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAttributableCo2EquivalentKg",
    label: "Actual independently attributable co2 equivalent kg",
    kind: "numberList",
  },
  {
    id: "actualMatchedInventoryAreaHectares",
    label: "Actual matched inventory area hectares",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyAttributableCo2EquivalentKg.length)
    simpleError(
      "actualIndependentlyAttributableCo2EquivalentKg",
      "Actualnonemptyobservations.",
    );
  positive(
    input.actualMatchedInventoryAreaHectares,
    "actualMatchedInventoryAreaHectares",
  );
  return {
    value:
      sum(input.actualIndependentlyAttributableCo2EquivalentKg) /
      input.actualMatchedInventoryAreaHectares,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyAttributableCo2EquivalentKg: [10, 20],
    actualMatchedInventoryAreaHectares: 2,
  },
  output: { result: { value: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/greenhouse-gas-emission-per-hectare",
  title: "Agriculture Greenhouse Gas Emission Per Hectare Calculator",
  description:
    "Actualindependently alreadyconverted nonoverlappingCO2eledgerkgperha,sameyear/scope/metricedition,no inventedemissionfactors or carbonneutralitycertificate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
