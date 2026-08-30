import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned, mean } from "../shared.js";
export type Input = Readonly<{
  readonly offshoreDistancesM: readonly number[];
  readonly positiveWaterDepthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedDeanParameterMToOneThird: number;
  readonly rootMeanSquaredDepthResidualM: number;
}>;
const inputFields = [
  {
    id: "offshoreDistancesM",
    label: "Offshore distances m",
    kind: "numberList",
  },
  {
    id: "positiveWaterDepthsM",
    label: "Positive water depths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.offshoreDistancesM.forEach((v) => positive(v, "offshoreDistancesM"));
  input.positiveWaterDepthsM.forEach((v) =>
    positive(v, "positiveWaterDepthsM"),
  );
  aligned(
    input.offshoreDistancesM,
    input.positiveWaterDepthsM,
    "offshoreDistancesM",
  );
  const x = input.offshoreDistancesM.map((v) => v ** (2 / 3)),
    den = positive(
      x.reduce((s, v) => s + v * v, 0),
      "offshoreDistancesM",
    ),
    A = input.positiveWaterDepthsM.reduce((s, v, i) => s + v * x[i], 0) / den;
  return {
    fittedDeanParameterMToOneThird: A,
    rootMeanSquaredDepthResidualM: Math.sqrt(
      mean(input.positiveWaterDepthsM.map((v, i) => (v - A * x[i]) ** 2)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  offshoreDistancesM: [1, 8, 27],
  positiveWaterDepthsM: [2, 8, 18],
} satisfies Input;
export const exampleOutput = {
  fittedDeanParameterMToOneThird: 2,
  rootMeanSquaredDepthResidualM: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/equilibrium-beach-profile-dean-param",
  title: "Equilibrium Beach Profile Dean Parameter",
  description:
    "Fit Dean h=A x^(2/3) through the supplied shoreline origin by depth-residual least squares; not a universal grain-size lookup or free-origin profile fit.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedDeanParameterMToOneThird",
      label: "Fitted dean parameter m to one third",
      kind: "number",
    },
    {
      id: "rootMeanSquaredDepthResidualM",
      label: "Root mean squared depth residual m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      offshoreDistancesM: value.offshoreDistancesM as readonly number[],
      positiveWaterDepthsM: value.positiveWaterDepthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
