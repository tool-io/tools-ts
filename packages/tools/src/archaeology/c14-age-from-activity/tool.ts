import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyNormalizedFractionModernActivity: number;
  readonly callerDecayHalfLifeYears: number;
}>;
export type Output = Readonly<{
  readonly uncalibratedExponentialAgeYears: number;
}>;
const inputFields = [
  {
    id: "independentlyNormalizedFractionModernActivity",
    label: "Independently normalized fraction modern activity",
    kind: "number",
  },
  {
    id: "callerDecayHalfLifeYears",
    label: "Caller decay half life years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyNormalizedFractionModernActivity,
    "independentlyNormalizedFractionModernActivity",
  );
  positive(input.callerDecayHalfLifeYears, "callerDecayHalfLifeYears");
  return {
    uncalibratedExponentialAgeYears:
      (-input.callerDecayHalfLifeYears / Math.LN2) *
      Math.log(input.independentlyNormalizedFractionModernActivity),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyNormalizedFractionModernActivity: 0.5,
  callerDecayHalfLifeYears: 5730,
} satisfies Input;
export const exampleOutput = {
  uncalibratedExponentialAgeYears: 5730,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/c14-age-from-activity",
  title: "C14 Age From Activity Calculator",
  description:
    "Closed-system exponential C14 age with explicitly supplied half-life and independently background/fractionation/reference-normalized activity; >1 gives signed modern age, not calendar calibration or conventional Libbyage unless caller selects 5568. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "uncalibratedExponentialAgeYears",
      label: "Uncalibrated exponential age years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyNormalizedFractionModernActivity:
        value.independentlyNormalizedFractionModernActivity as number,
      callerDecayHalfLifeYears: value.callerDecayHalfLifeYears as number,
    }),
});
export const run = tool.execute;
export default tool;
