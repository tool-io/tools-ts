import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualPoleTopHoistPosition: number;
  readonly callerIndependentRequiredLoweringDistance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPoleTopHoistPosition",
    label: "Actual pole top hoist position",
    kind: "number",
  },
  {
    id: "callerIndependentRequiredLoweringDistance",
    label: "Caller independent required lowering distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualPoleTopHoistPosition, "top");
  nonnegative(input.callerIndependentRequiredLoweringDistance, "lowering");
  if (
    input.callerIndependentRequiredLoweringDistance >
    input.actualPoleTopHoistPosition
  )
    simpleError("position", "Declaredin-polerange.");
  return {
    qualifiedHalfStaffHoistPosition:
      input.actualPoleTopHoistPosition -
      input.callerIndependentRequiredLoweringDistance,
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
    actualPoleTopHoistPosition: 10,
    callerIndependentRequiredLoweringDistance: 3,
  },
  output: { result: { qualifiedHalfStaffHoistPosition: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/half-staff-position",
  title: "Half-Staff Hoist Position Calculator",
  description:
    "ActualtoppositionminusINDEPENDENTprotocolrequiredloweringdistance,not assumesuniversalhalfpoleorauthorizeshalfstaff. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
