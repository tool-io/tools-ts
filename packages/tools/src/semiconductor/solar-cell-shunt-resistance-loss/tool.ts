import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCellOperatingVoltagesVolts: readonly number[];
  readonly callerIndependentlyMeasuredShuntResistanceOhms: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCellOperatingVoltagesVolts",
    label: "Actual cell operating voltages volts",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredShuntResistanceOhms",
    label: "Caller independently measured shunt resistance ohms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerIndependentlyMeasuredShuntResistanceOhms, "shuntR");
  if (!input.actualCellOperatingVoltagesVolts.length)
    simpleError("points", "Actual operating-voltage inventory.");
  return {
    conditionalShuntLossWattsByOperatingPoint:
      input.actualCellOperatingVoltagesVolts.map(
        (v) => (v * v) / input.callerIndependentlyMeasuredShuntResistanceOhms,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCellOperatingVoltagesVolts: [1, 2],
    callerIndependentlyMeasuredShuntResistanceOhms: 2,
  },
  output: { result: { conditionalShuntLossWattsByOperatingPoint: [0.5, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/solar-cell-shunt-resistance-loss",
  title: "Semiconductor Solar Cell Shunt Resistance Loss Calculator",
  description:
    "Actual solar-cell operating-voltage parallel V\u00b2/Rloss scenario, not series I\u00b2Ror measured total efficiency degradation.",
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
