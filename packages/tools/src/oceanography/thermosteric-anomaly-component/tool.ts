import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned, layers } from "../shared.js";
export type Input = Readonly<{
  readonly layerBoundariesM: readonly number[];
  readonly temperatureAnomaliesK: readonly number[];
  readonly expansionCoefficientsPerK: readonly number[];
}>;
export type Output = Readonly<{
  readonly layerThermostericContributionsM: readonly number[];
  readonly thermostericAnomalyM: number;
}>;
const inputFields = [
  { id: "layerBoundariesM", label: "Layer boundaries m", kind: "numberList" },
  {
    id: "temperatureAnomaliesK",
    label: "Temperature anomalies k",
    kind: "numberList",
  },
  {
    id: "expansionCoefficientsPerK",
    label: "Expansion coefficients per k",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.expansionCoefficientsPerK.forEach((v) =>
    positive(v, "expansionCoefficientsPerK"),
  );
  aligned(
    input.temperatureAnomaliesK,
    input.expansionCoefficientsPerK,
    "temperatureAnomaliesK",
  );
  layers(input.layerBoundariesM, input.temperatureAnomaliesK);
  const layerThermostericContributionsM = input.temperatureAnomaliesK.map(
    (v, i) =>
      v *
      input.expansionCoefficientsPerK[i] *
      (input.layerBoundariesM[i + 1] - input.layerBoundariesM[i]),
  );
  return {
    layerThermostericContributionsM,
    thermostericAnomalyM: layerThermostericContributionsM.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerBoundariesM: [0, 10, 30],
  temperatureAnomaliesK: [1, -2],
  expansionCoefficientsPerK: [0.001, 0.002],
} satisfies Input;
export const exampleOutput = {
  layerThermostericContributionsM: [0.01, -0.08],
  thermostericAnomalyM: -0.07,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/thermosteric-anomaly-component",
  title: "Thermosteric Anomaly Component",
  description:
    "Integrate signed small-anomaly thermal expansion over caller layers; holds salinity/mass fixed and differs from exact density-ratio steric stretching.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerThermostericContributionsM",
      label: "Layer thermosteric contributions m",
      kind: "numberList",
    },
    {
      id: "thermostericAnomalyM",
      label: "Thermosteric anomaly m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerBoundariesM: value.layerBoundariesM as readonly number[],
      temperatureAnomaliesK: value.temperatureAnomaliesK as readonly number[],
      expansionCoefficientsPerK:
        value.expansionCoefficientsPerK as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
