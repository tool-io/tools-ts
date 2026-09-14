import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerIndependentEffectiveDrainageArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentEffectiveDrainageArea",
    label: "Caller independent effective drainage area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentEffectiveDrainageArea,
    "callerIndependentEffectiveDrainageArea",
  );
  return {
    value: Math.sqrt(input.callerIndependentEffectiveDrainageArea / Math.PI),
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
  input: { callerIndependentEffectiveDrainageArea: 12.566370614359172 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/drainage-radius",
  title: "Petroleum Drainage Radius Calculator",
  description:
    "Equivalentcircularradialdrainage-area radius\u221a(A/\u03c0),not estimateactualboundaryfromwell spacingwithoutsurvey/reservoirassessment.",
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
