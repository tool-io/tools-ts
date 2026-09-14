import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyTrackedFeatureDisplacementMeters: number;
  readonly actualMatchedElapsedDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyTrackedFeatureDisplacementMeters",
    label: "Actual independently tracked feature displacement meters",
    kind: "number",
  },
  {
    id: "actualMatchedElapsedDays",
    label: "Actual matched elapsed days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualMatchedElapsedDays, "actualMatchedElapsedDays");
  return {
    value:
      input.actualIndependentlyTrackedFeatureDisplacementMeters /
      input.actualMatchedElapsedDays,
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
    actualIndependentlyTrackedFeatureDisplacementMeters: 10,
    actualMatchedElapsedDays: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/feature-tracking-displacement-rate",
  title: "Feature Tracking Displacement Rate Calculator",
  description:
    "Observedfeaturedisplacementrate m/day,not automaticallyiceparcelvelocity or resolved2Dgeometricregistration. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
