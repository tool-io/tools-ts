import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualSteadyOilVolumeRate: number;
  readonly actualIndependentReservoirMinusBottomholePressure: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSteadyOilVolumeRate",
    label: "Actual steady oil volume rate",
    kind: "number",
  },
  {
    id: "actualIndependentReservoirMinusBottomholePressure",
    label: "Actual independent reservoir minus bottomhole pressure",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSteadyOilVolumeRate, "actualSteadyOilVolumeRate");
  positive(
    input.actualIndependentReservoirMinusBottomholePressure,
    "actualIndependentReservoirMinusBottomholePressure",
  );
  return {
    value:
      input.actualSteadyOilVolumeRate /
      input.actualIndependentReservoirMinusBottomholePressure,
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
    actualSteadyOilVolumeRate: 10,
    actualIndependentReservoirMinusBottomholePressure: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/productivity-index-pi",
  title: "Petroleum Productivity Index PI Calculator",
  description:
    "Actualsingle-phasequalifiedsteadyPI q/(pr\u2212pw),matchedvolumebasis/units,not HornerfitPIor skin/productionforecast.",
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
