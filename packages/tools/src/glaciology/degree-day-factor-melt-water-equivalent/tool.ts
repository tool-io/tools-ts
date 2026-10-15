import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyCalibratedWaterEquivalentDegreeDayFactor: number;
  readonly actualPositiveDegreeDays: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerIndependentlyCalibratedWaterEquivalentDegreeDayFactor",
    label: "Caller independently calibrated water equivalent degree day factor",
    kind: "number",
  },
  {
    id: "actualPositiveDegreeDays",
    label: "Actual positive degree days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.callerIndependentlyCalibratedWaterEquivalentDegreeDayFactor,
    "callerIndependentlyCalibratedWaterEquivalentDegreeDayFactor",
  );
  nonnegative(input.actualPositiveDegreeDays, "actualPositiveDegreeDays");
  return {
    value:
      input.callerIndependentlyCalibratedWaterEquivalentDegreeDayFactor *
      input.actualPositiveDegreeDays,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerIndependentlyCalibratedWaterEquivalentDegreeDayFactor: 2,
    actualPositiveDegreeDays: 10,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/degree-day-factor-melt-water-equivalent",
  title: "Degree Day Factor Melt Water Equivalent Calculator",
  description:
    "Conditionalpositivedegree-days\u00d7matchedwaterequivalentmeltfactor,not chooseice/snowfactoror actualenergybudgetmelt. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
