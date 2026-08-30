import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly alongFlowDistancesM: readonly number[];
  readonly alongFlowVelocitiesMPerYear: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalLongitudinalStrainRatesPerYear: readonly number[];
}>;
const inputFields = [
  {
    id: "alongFlowDistancesM",
    label: "Along flow distances m",
    kind: "numberList",
  },
  {
    id: "alongFlowVelocitiesMPerYear",
    label: "Along flow velocities m per year",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.alongFlowDistancesM,
    input.alongFlowVelocitiesMPerYear,
    "alongFlowDistancesM",
  );
  ordered(input.alongFlowDistancesM, "alongFlowDistancesM");
  return {
    intervalLongitudinalStrainRatesPerYear: input.alongFlowDistancesM
      .slice(1)
      .map(
        (x, i) =>
          (input.alongFlowVelocitiesMPerYear[i + 1] -
            input.alongFlowVelocitiesMPerYear[i]) /
          (x - input.alongFlowDistancesM[i]),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  alongFlowDistancesM: [0, 100, 300],
  alongFlowVelocitiesMPerYear: [10, 20, 60],
} satisfies Input;
export const exampleOutput = {
  intervalLongitudinalStrainRatesPerYear: [0.1, 0.2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/longitudinal-strain-rate",
  title: "Longitudinal Strain Rate",
  description:
    "Estimate interval longitudinal normal strain rate from velocity gradients along a supplied flow transect; not transverse or tensor shear strain.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalLongitudinalStrainRatesPerYear",
      label: "Interval longitudinal strain rates per year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      alongFlowDistancesM: value.alongFlowDistancesM as readonly number[],
      alongFlowVelocitiesMPerYear:
        value.alongFlowVelocitiesMPerYear as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
