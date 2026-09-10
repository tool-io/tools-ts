import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSubcellVoltagesAtSameSeriesCurrent: readonly number[];
  readonly actualInterconnectVoltageLoss: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredSubcellVoltagesAtSameSeriesCurrent",
    label: "Independently measured subcell voltages at same series current",
    kind: "numberList",
  },
  {
    id: "actualInterconnectVoltageLoss",
    label: "Actual interconnect voltage loss",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyMeasuredSubcellVoltagesAtSameSeriesCurrent.length)
    simpleError("cells", "Actual independently matched operating point.");
  nonnegative(input.actualInterconnectVoltageLoss, "loss");
  return {
    conditionalSeriesTandemTerminalVoltage:
      sum(input.independentlyMeasuredSubcellVoltagesAtSameSeriesCurrent) -
      input.actualInterconnectVoltageLoss,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredSubcellVoltagesAtSameSeriesCurrent: [0.5, 0.7],
    actualInterconnectVoltageLoss: 0.1,
  },
  output: { result: { conditionalSeriesTandemTerminalVoltage: 1.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/tandem-cell-voltage-addition",
  title: "Semiconductor Tandem Cell Voltage Addition Calculator",
  description:
    "Actual equal-series-current subcell voltage sum minus independently measured interconnect loss. Not combine each cells different-current MPPor promise a tandem operating point.",
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
