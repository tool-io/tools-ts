import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  mean,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDailyTrainingLoad: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDailyTrainingLoad",
    label: "Actual daily training load",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (input.actualDailyTrainingLoad.length < 2)
    simpleError("days", "Atleasttwoactualdaysincludingrest zeros.");
  input.actualDailyTrainingLoad.forEach((v) => nonnegative(v, "load"));
  const m = mean(input.actualDailyTrainingLoad),
    s = Math.sqrt(mean(input.actualDailyTrainingLoad.map((v) => (v - m) ** 2)));
  positive(s, "SD");
  return {
    meanDailyLoad: m,
    populationDailyLoadSd: s,
    monotony: m / s,
    strain: (sum(input.actualDailyTrainingLoad) * m) / s,
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
  input: { actualDailyTrainingLoad: [1, 2, 3] },
  output: {
    result: {
      meanDailyLoad: 2,
      populationDailyLoadSd: 0.816496580927726,
      monotony: 2.449489742783178,
      strain: 14.696938456699069,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/monotony-strain-index-foster",
  title: "Foster Monotony & Strain Index Calculator",
  description:
    "DeclaredFostermonotonymean/POPULATIONSDandstrain\u03a3load\u00d7monotony,nophysiologicalovertrainingdiagnosis. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
