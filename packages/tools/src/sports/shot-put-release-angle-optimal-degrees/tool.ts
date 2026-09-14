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
  readonly actualReleaseSpeed: number;
  readonly callerGravity: number;
  readonly actualReleaseHeightAboveLanding: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualReleaseSpeed", label: "Actual release speed", kind: "number" },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "actualReleaseHeightAboveLanding",
    label: "Actual release height above landing",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualReleaseSpeed, "actualReleaseSpeed");
  positive(input.callerGravity, "callerGravity");
  nonnegative(
    input.actualReleaseHeightAboveLanding,
    "actualReleaseHeightAboveLanding",
  );
  return {
    value:
      (Math.atan(
        input.actualReleaseSpeed /
          Math.sqrt(
            input.actualReleaseSpeed ** 2 +
              2 * input.callerGravity * input.actualReleaseHeightAboveLanding,
          ),
      ) *
        180) /
      Math.PI,
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
    actualReleaseSpeed: 1,
    callerGravity: 1,
    actualReleaseHeightAboveLanding: 0,
  },
  output: { result: { value: 45 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/shot-put-release-angle-optimal-degrees",
  title: "Optimal Shot Put Release Angle",
  description:
    "Idealvacuumflatlandingrangeoptimum\u03b8=atan(v/\u221a(v\u00b2+2gh)) FIXEDspeed independentofangle;not humanoptimalshotputangle. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
