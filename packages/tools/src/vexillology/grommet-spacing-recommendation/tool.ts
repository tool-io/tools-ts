import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualHoistLength: number;
  readonly callerActualEdgeOffset: number;
  readonly callerIndependentRequiredGrommetCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualHoistLength", label: "Actual hoist length", kind: "number" },
  {
    id: "callerActualEdgeOffset",
    label: "Caller actual edge offset",
    kind: "number",
  },
  {
    id: "callerIndependentRequiredGrommetCount",
    label: "Caller independent required grommet count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualHoistLength, "H");
  nonnegative(input.callerActualEdgeOffset, "offset");
  bounded(input.callerIndependentRequiredGrommetCount, "count", 2, 64);
  const s = input.actualHoistLength - 2 * input.callerActualEdgeOffset;
  positive(s, "usable");
  return {
    grommetCenterPositions: Array.from(
      { length: input.callerIndependentRequiredGrommetCount },
      (_, i) =>
        input.callerActualEdgeOffset +
        (i * s) / (input.callerIndependentRequiredGrommetCount - 1),
    ),
    uniformCenterSpacing: s / (input.callerIndependentRequiredGrommetCount - 1),
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
    actualHoistLength: 10,
    callerActualEdgeOffset: 1,
    callerIndependentRequiredGrommetCount: 3,
  },
  output: {
    result: { grommetCenterPositions: [1, 5, 9], uniformCenterSpacing: 4 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/grommet-spacing-recommendation",
  title: "Grommet Spacing Recommendation Calculator",
  description:
    "Geometricuniformgrommetlayoutunderindependentlyrequiredcount/edgeoffset,doesNOTrecommendfastenerstrength/spacing or windrateddesign. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
