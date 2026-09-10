import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  mean,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSystolicVelocity: number;
  readonly independentlyMeasuredEndDiastolicVelocity: number;
  readonly independentlyMeasuredCycleMeanVelocity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredSystolicVelocity",
    label: "Independently measured systolic velocity",
    kind: "number",
  },
  {
    id: "independentlyMeasuredEndDiastolicVelocity",
    label: "Independently measured end diastolic velocity",
    kind: "number",
  },
  {
    id: "independentlyMeasuredCycleMeanVelocity",
    label: "Independently measured cycle mean velocity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredSystolicVelocity, "systolic");
  positive(input.independentlyMeasuredCycleMeanVelocity, "cycle-mean");
  if (
    input.independentlyMeasuredEndDiastolicVelocity >
    input.independentlyMeasuredSystolicVelocity
  )
    simpleError(
      "flow",
      "Independent systolic peak must not be below stated end-diastolic velocity.",
    );
  return {
    observedPulsatilityIndex:
      (input.independentlyMeasuredSystolicVelocity -
        input.independentlyMeasuredEndDiastolicVelocity) /
      input.independentlyMeasuredCycleMeanVelocity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredSystolicVelocity: 100,
    independentlyMeasuredEndDiastolicVelocity: 40,
    independentlyMeasuredCycleMeanVelocity: 70,
  },
  output: { result: { observedPulsatilityIndex: 0.8571428571428571 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/uterine-artery-pi",
  title: "Uterine Artery PI Calculator",
  description:
    "Actual uterine-artery PI=(systolic\u2212diastolic)/cycle-mean velocity, matching units and acquisition. Negative end-diastolic flow retained; actual cycle mean supplied, not an assumed arithmetic mean. No clinical diagnosis or universal gestational reference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
