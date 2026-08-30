import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly weibullScaleYears: number;
  readonly weibullShape: number;
  readonly elapsedReposeYears: number;
  readonly futureWindowYears: number;
}>;
export type Output = Readonly<{
  readonly conditionalModelEventProbability: number;
  readonly cumulativeModelEventProbabilityByWindowEnd: number;
}>;
const inputFields = [
  { id: "weibullScaleYears", label: "Weibull scale years", kind: "number" },
  { id: "weibullShape", label: "Weibull shape", kind: "number" },
  { id: "elapsedReposeYears", label: "Elapsed repose years", kind: "number" },
  { id: "futureWindowYears", label: "Future window years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.weibullScaleYears, "weibullScaleYears");
  positive(input.weibullShape, "weibullShape");
  nonnegative(input.elapsedReposeYears, "elapsedReposeYears");
  nonnegative(input.futureWindowYears, "futureWindowYears");
  const a = input.elapsedReposeYears / input.weibullScaleYears,
    h = input.futureWindowYears / input.weibullScaleYears,
    start = a ** input.weibullShape,
    end = (a + h) ** input.weibullShape;
  const delta =
    h === 0
      ? 0
      : a === 0
        ? end
        : start * Math.expm1(input.weibullShape * Math.log1p(h / a));
  if (!Number.isFinite(delta) || !Number.isFinite(end))
    simpleError("repose", "Unrepresentable conditional model hazard.");
  return {
    conditionalModelEventProbability: -Math.expm1(-delta),
    cumulativeModelEventProbabilityByWindowEnd: -Math.expm1(-end),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  weibullScaleYears: 10,
  weibullShape: 2,
  elapsedReposeYears: 10,
  futureWindowYears: 10,
} satisfies Input;
export const exampleOutput = {
  conditionalModelEventProbability: 0.950212931632136,
  cumulativeModelEventProbabilityByWindowEnd: 0.9816843611112658,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/weibull-repose-failure-probability",
  title: "Weibull Repose Failure Probability",
  description:
    "Evaluate conditional Weibull renewal probability given no event through elapsed repose, using supplied fitted parameters and stable hazard increments; model probabilities are not validated volcano-specific eruption risk.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalModelEventProbability",
      label: "Conditional model event probability",
      kind: "number",
    },
    {
      id: "cumulativeModelEventProbabilityByWindowEnd",
      label: "Cumulative model event probability by window end",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      weibullScaleYears: value.weibullScaleYears as number,
      weibullShape: value.weibullShape as number,
      elapsedReposeYears: value.elapsedReposeYears as number,
      futureWindowYears: value.futureWindowYears as number,
    }),
});
export const run = tool.execute;
export default tool;
