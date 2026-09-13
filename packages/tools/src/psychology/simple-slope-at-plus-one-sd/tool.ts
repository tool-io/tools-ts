import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPredictorCoefficient: number;
  readonly actualInteractionCoefficient: number;
  readonly callerModeratorMean: number;
  readonly callerModeratorSd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPredictorCoefficient",
    label: "Actual predictor coefficient",
    kind: "number",
  },
  {
    id: "actualInteractionCoefficient",
    label: "Actual interaction coefficient",
    kind: "number",
  },
  {
    id: "callerModeratorMean",
    label: "Caller mode rat or mean",
    kind: "number",
  },
  { id: "callerModeratorSd", label: "Caller mode rat or sd", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerModeratorSd, "moderatorSD");
  return {
    conditionalSlopeAtPlusOneSd:
      input.actualPredictorCoefficient +
      input.actualInteractionCoefficient *
        (input.callerModeratorMean + input.callerModeratorSd),
    conditionalSlopeAtMinusOneSd:
      input.actualPredictorCoefficient +
      input.actualInteractionCoefficient *
        (input.callerModeratorMean - input.callerModeratorSd),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPredictorCoefficient: 2,
    actualInteractionCoefficient: 3,
    callerModeratorMean: 1,
    callerModeratorSd: 2,
  },
  output: {
    result: {
      conditionalSlopeAtPlusOneSd: 11,
      conditionalSlopeAtMinusOneSd: -1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/simple-slope-at-plus-one-sd",
  title: "Simple Slope at +/-1 SD Calculator",
  description:
    "Specified linear interaction simple slopes at actual mode rat or mean\u00b1SD, centering/coefficient units independently matched. No standard error, causal effect or significance test.",
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
