import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly desiredDoughTemperatureC: number;
  readonly observedNonWaterTemperaturesC: readonly number[];
  readonly callerNonWaterThermalWeights: readonly number[];
  readonly callerWaterThermalWeight: number;
  readonly independentFrictionRiseC: number;
}>;
export type Output = Readonly<{
  readonly conditionalMixWaterTemperatureC: number;
}>;
const inputFields = [
  {
    id: "desiredDoughTemperatureC",
    label: "Desired dough temperature c",
    kind: "number",
  },
  {
    id: "observedNonWaterTemperaturesC",
    label: "Observed non water temperatures c",
    kind: "numberList",
  },
  {
    id: "callerNonWaterThermalWeights",
    label: "Caller non water thermal weights",
    kind: "numberList",
  },
  {
    id: "callerWaterThermalWeight",
    label: "Caller water thermal weight",
    kind: "number",
  },
  {
    id: "independentFrictionRiseC",
    label: "Independent friction rise c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerNonWaterThermalWeights.forEach((v) =>
    positive(v, "callerNonWaterThermalWeights"),
  );
  positive(input.callerWaterThermalWeight, "callerWaterThermalWeight");
  nonnegative(input.independentFrictionRiseC, "independentFrictionRiseC");
  aligned(
    input.observedNonWaterTemperaturesC,
    input.callerNonWaterThermalWeights,
    "observedNonWaterTemperaturesC",
  );
  const s = sum(input.callerNonWaterThermalWeights),
    q = sum(
      input.observedNonWaterTemperaturesC.map(
        (v, i) => v * input.callerNonWaterThermalWeights[i],
      ),
    );
  return {
    conditionalMixWaterTemperatureC:
      ((input.desiredDoughTemperatureC - input.independentFrictionRiseC) *
        (s + input.callerWaterThermalWeight) -
        q) /
      input.callerWaterThermalWeight,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  desiredDoughTemperatureC: 30,
  observedNonWaterTemperaturesC: [20, 25],
  callerNonWaterThermalWeights: [1, 1],
  callerWaterThermalWeight: 2,
  independentFrictionRiseC: 2,
} satisfies Input;
export const exampleOutput = {
  conditionalMixWaterTemperatureC: 33.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/water-temperature-for-ddt",
  title: "Cooking Water Temperature For Ddt Calculator",
  description:
    "Invert independently characterized heat-capacity mixing balance for water temperature; caller confirms feasibility, no fixed DDT factor or safe mixing-temperature instruction. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalMixWaterTemperatureC",
      label: "Conditional mix water temperature c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      desiredDoughTemperatureC: value.desiredDoughTemperatureC as number,
      observedNonWaterTemperaturesC:
        value.observedNonWaterTemperaturesC as readonly number[],
      callerNonWaterThermalWeights:
        value.callerNonWaterThermalWeights as readonly number[],
      callerWaterThermalWeight: value.callerWaterThermalWeight as number,
      independentFrictionRiseC: value.independentFrictionRiseC as number,
    }),
});
export const run = tool.execute;
export default tool;
