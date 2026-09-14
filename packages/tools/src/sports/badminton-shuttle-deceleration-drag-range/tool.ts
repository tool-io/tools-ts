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
  readonly callerIndependentQuadraticDragCoefficient: number;
  readonly actualInitialShuttleSpeed: number;
  readonly actualElapsedSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentQuadraticDragCoefficient",
    label: "Caller independent quadratic drag coefficient",
    kind: "number",
  },
  {
    id: "actualInitialShuttleSpeed",
    label: "Actual initial shuttle speed",
    kind: "number",
  },
  {
    id: "actualElapsedSeconds",
    label: "Actual elapsed seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentQuadraticDragCoefficient,
    "callerIndependentQuadraticDragCoefficient",
  );
  nonnegative(input.actualInitialShuttleSpeed, "actualInitialShuttleSpeed");
  nonnegative(input.actualElapsedSeconds, "actualElapsedSeconds");
  return {
    value:
      Math.log1p(
        input.callerIndependentQuadraticDragCoefficient *
          input.actualInitialShuttleSpeed *
          input.actualElapsedSeconds,
      ) / input.callerIndependentQuadraticDragCoefficient,
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
    callerIndependentQuadraticDragCoefficient: 1,
    actualInitialShuttleSpeed: 2,
    actualElapsedSeconds: 1,
  },
  output: { result: { value: 1.0986122886681096 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/badminton-shuttle-deceleration-drag-range",
  title: "Shuttlecock Drag Deceleration Range Estimator",
  description:
    "Restrictedonedimensionaldu/dt=\u2212k u\u00b2shuttlehorizontalrange ln(1+ku0t)/k,gravity/liftrotationomitted;not actualbadmintonlandingrange. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
