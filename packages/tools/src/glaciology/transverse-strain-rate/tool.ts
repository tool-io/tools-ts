import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly crossFlowDistancesM: readonly number[];
  readonly transverseVelocitiesMYear: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalTransverseNormalStrainRatesPerYear: readonly number[];
  readonly intervalCenterDistancesM: readonly number[];
}>;
const inputFields = [
  {
    id: "crossFlowDistancesM",
    label: "Cross flow distances m",
    kind: "numberList",
  },
  {
    id: "transverseVelocitiesMYear",
    label: "Transverse velocities m year",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.crossFlowDistancesM,
    input.transverseVelocitiesMYear,
    "crossFlowDistancesM",
  );
  strictlyIncreasing(input.crossFlowDistancesM, "crossFlow");
  return {
    intervalTransverseNormalStrainRatesPerYear: input.transverseVelocitiesMYear
      .slice(1)
      .map(
        (v, i) =>
          (v - input.transverseVelocitiesMYear[i]) /
          (input.crossFlowDistancesM[i + 1] - input.crossFlowDistancesM[i]),
      ),
    intervalCenterDistancesM: input.crossFlowDistancesM
      .slice(1)
      .map((v, i) => v / 2 + input.crossFlowDistancesM[i] / 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crossFlowDistancesM: [0, 10, 30],
  transverseVelocitiesMYear: [0, 2, -2],
} satisfies Input;
export const exampleOutput = {
  intervalTransverseNormalStrainRatesPerYear: [0.2, -0.2],
  intervalCenterDistancesM: [5, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/transverse-strain-rate",
  title: "Transverse Strain Rate Calculator",
  description:
    "Compute transverse normal strain dv/dy on measured local cross-flow transect with signed compression/extension; not longitudinal du/dx, engineering shear or geodesy coordinates.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalTransverseNormalStrainRatesPerYear",
      label: "Interval transverse normal strain rates per year",
      kind: "numberList",
    },
    {
      id: "intervalCenterDistancesM",
      label: "Interval center distances m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      crossFlowDistancesM: value.crossFlowDistancesM as readonly number[],
      transverseVelocitiesMYear:
        value.transverseVelocitiesMYear as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
