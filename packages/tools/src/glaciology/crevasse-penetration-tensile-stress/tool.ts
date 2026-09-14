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
  readonly callerIndependentDepthUniformTensileStress: number;
  readonly actualIceDensity: number;
  readonly callerGravity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentDepthUniformTensileStress",
    label: "Caller independent depth uniform tensile stress",
    kind: "number",
  },
  { id: "actualIceDensity", label: "Actual ice density", kind: "number" },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentDepthUniformTensileStress,
    "callerIndependentDepthUniformTensileStress",
  );
  positive(input.actualIceDensity, "actualIceDensity");
  positive(input.callerGravity, "callerGravity");
  return {
    value:
      (2 * input.callerIndependentDepthUniformTensileStress) /
      (input.actualIceDensity * input.callerGravity),
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
    callerIndependentDepthUniformTensileStress: 1,
    actualIceDensity: 1,
    callerGravity: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/crevasse-penetration-tensile-stress",
  title: "Crevasse Penetration Tensile Stress Calculator",
  description:
    "RestrictedNyezerowatercrevasse-depth2\u03c3/(\u03c1g) stressbalance,unrealisticuniformtensionandnowaterpressureexplicit,not crackmechanicsor mountaineering safety. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
