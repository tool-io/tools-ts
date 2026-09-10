import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCellOperatingCurrentsAmps: readonly number[];
  readonly callerIndependentlyMeasuredSeriesResistanceOhms: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCellOperatingCurrentsAmps",
    label: "Actual cell operating currents amps",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredSeriesResistanceOhms",
    label: "Caller independently measured series resistance ohms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerIndependentlyMeasuredSeriesResistanceOhms, "seriesR");
  if (!input.actualCellOperatingCurrentsAmps.length)
    simpleError("points", "Actual operating-current inventory.");
  return {
    conditionalSeriesLossWattsByOperatingPoint:
      input.actualCellOperatingCurrentsAmps.map(
        (v) => v * v * input.callerIndependentlyMeasuredSeriesResistanceOhms,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCellOperatingCurrentsAmps: [1, 2],
    callerIndependentlyMeasuredSeriesResistanceOhms: 0.5,
  },
  output: { result: { conditionalSeriesLossWattsByOperatingPoint: [0.5, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/solar-cell-series-resistance-loss",
  title: "Semiconductor Solar Cell Series Resistance Loss Calculator",
  description:
    "Actual solar-cell operating-current series I\u00b2Rloss scenario, not fill-factor inference or measured total efficiency degradation.",
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
