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
  readonly actualVerticalLaunchSpeed: number;
  readonly callerGravity: number;
  readonly actualLaunchHeightAboveLanding: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualVerticalLaunchSpeed",
    label: "Actual vertical launch speed",
    kind: "number",
  },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "actualLaunchHeightAboveLanding",
    label: "Actual launch height above landing",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualVerticalLaunchSpeed, "actualVerticalLaunchSpeed");
  positive(input.callerGravity, "callerGravity");
  nonnegative(
    input.actualLaunchHeightAboveLanding,
    "actualLaunchHeightAboveLanding",
  );
  return {
    value:
      (input.actualVerticalLaunchSpeed +
        Math.sqrt(
          input.actualVerticalLaunchSpeed ** 2 +
            2 * input.callerGravity * input.actualLaunchHeightAboveLanding,
        )) /
      input.callerGravity,
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
    actualVerticalLaunchSpeed: 1,
    callerGravity: 1,
    actualLaunchHeightAboveLanding: 0,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/snowboard-airtime-jump-duration",
  title: "Snowboard Jump Airtime Duration",
  description:
    "Idealvacuumjumpairtimepositiveflightroot,matchedhigherlaunch/noairdrag;not landingsafety. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
