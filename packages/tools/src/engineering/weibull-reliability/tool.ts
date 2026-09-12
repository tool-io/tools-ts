import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  finite,
  expFinite,
} from "../batch49-shared.js";
export type Input = Readonly<{
  elapsedTime: number;
  callerCalibratedWeibullScale: number;
  callerCalibratedShape: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "elapsedTime", label: "Elapsed time", kind: "number" },
  {
    id: "callerCalibratedWeibullScale",
    label: "Caller calibrated Weibull scale",
    kind: "number",
  },
  {
    id: "callerCalibratedShape",
    label: "Caller calibrated shape",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  nonnegative(input.elapsedTime, "elapsedTime");
  positive(input.callerCalibratedWeibullScale, "callerCalibratedWeibullScale");
  positive(input.callerCalibratedShape, "callerCalibratedShape");
  return finish({
    result: {
      value: expFinite(
        -finite(
          (input.elapsedTime / input.callerCalibratedWeibullScale) **
            input.callerCalibratedShape,
        ),
      ),
    },
  });
};
export const example = {
  input: {
    elapsedTime: 2,
    callerCalibratedWeibullScale: 1,
    callerCalibratedShape: 2,
  },
  output: { result: { value: 0.01831563888873418 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/weibull-reliability",
  title: "Weibull Reliability Calculator",
  description:
    "Conditional two-parameter Weibull reliability exp[−(t/η)^β], independently calibrated nonnegative time and positive scale/shape. No parameter fit or validated prediction. Actual independently established compatible units/model context; conditional arithmetic, not code compliance, engineering design or safe-operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
