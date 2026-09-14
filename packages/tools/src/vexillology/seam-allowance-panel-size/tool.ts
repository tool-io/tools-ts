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
  readonly actualFinishedPanelHoist: number;
  readonly actualFinishedPanelFly: number;
  readonly callerActualTopSeamAllowance: number;
  readonly callerActualBottomSeamAllowance: number;
  readonly callerActualLeftSeamAllowance: number;
  readonly callerActualRightSeamAllowance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFinishedPanelHoist",
    label: "Actual finished panel hoist",
    kind: "number",
  },
  {
    id: "actualFinishedPanelFly",
    label: "Actual finished panel fly",
    kind: "number",
  },
  {
    id: "callerActualTopSeamAllowance",
    label: "Caller actual top seam allowance",
    kind: "number",
  },
  {
    id: "callerActualBottomSeamAllowance",
    label: "Caller actual bottom seam allowance",
    kind: "number",
  },
  {
    id: "callerActualLeftSeamAllowance",
    label: "Caller actual left seam allowance",
    kind: "number",
  },
  {
    id: "callerActualRightSeamAllowance",
    label: "Caller actual right seam allowance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualFinishedPanelHoist, "H");
  positive(input.actualFinishedPanelFly, "F");
  [
    input.callerActualTopSeamAllowance,
    input.callerActualBottomSeamAllowance,
    input.callerActualLeftSeamAllowance,
    input.callerActualRightSeamAllowance,
  ].forEach((v) => nonnegative(v, "allowance"));
  return {
    cutPanelHoist:
      input.actualFinishedPanelHoist +
      input.callerActualTopSeamAllowance +
      input.callerActualBottomSeamAllowance,
    cutPanelFly:
      input.actualFinishedPanelFly +
      input.callerActualLeftSeamAllowance +
      input.callerActualRightSeamAllowance,
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
    actualFinishedPanelHoist: 2,
    actualFinishedPanelFly: 3,
    callerActualTopSeamAllowance: 0.1,
    callerActualBottomSeamAllowance: 0.2,
    callerActualLeftSeamAllowance: 0.3,
    callerActualRightSeamAllowance: 0.4,
  },
  output: {
    result: {
      cutPanelHoist: 2.3000000000000003,
      cutPanelFly: 3.6999999999999997,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/seam-allowance-panel-size",
  title: "Seam Allowance Adjusted Panel Size Calculator",
  description:
    "ActualFOURseparateedgesfinished-to-cut-panelallowances,no automaticseamprescription or wastagefactor. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
