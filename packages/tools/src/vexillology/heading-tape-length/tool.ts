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
  readonly actualFinishedHoist: number;
  readonly callerActualTopHeadingTurnback: number;
  readonly callerActualBottomHeadingTurnback: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFinishedHoist", label: "Actual finished hoist", kind: "number" },
  {
    id: "callerActualTopHeadingTurnback",
    label: "Caller actual top heading turnback",
    kind: "number",
  },
  {
    id: "callerActualBottomHeadingTurnback",
    label: "Caller actual bottom heading turnback",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualFinishedHoist, "actualFinishedHoist");
  nonnegative(
    input.callerActualTopHeadingTurnback,
    "callerActualTopHeadingTurnback",
  );
  nonnegative(
    input.callerActualBottomHeadingTurnback,
    "callerActualBottomHeadingTurnback",
  );
  return {
    value:
      input.actualFinishedHoist +
      input.callerActualTopHeadingTurnback +
      input.callerActualBottomHeadingTurnback,
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
    actualFinishedHoist: 2,
    callerActualTopHeadingTurnback: 0.5,
    callerActualBottomHeadingTurnback: 0.5,
  },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/heading-tape-length",
  title: "Hoist Heading Tape Length Calculator",
  description:
    "Actualheadingtapecutlengthhoistplusindependentlyselectedtop/bottomturnbacks,not designminimumtape strength. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
