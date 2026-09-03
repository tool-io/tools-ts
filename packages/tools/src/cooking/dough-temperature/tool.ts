import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedIngredientTemperaturesC: readonly number[];
  readonly callerIngredientThermalCapacityWeights: readonly number[];
  readonly independentFrictionTemperatureRiseC: number;
}>;
export type Output = Readonly<{
  readonly conditionalDoughTemperatureC: number;
}>;
const inputFields = [
  {
    id: "observedIngredientTemperaturesC",
    label: "Observed ingredient temperatures c",
    kind: "numberList",
  },
  {
    id: "callerIngredientThermalCapacityWeights",
    label: "Caller ingredient thermal capacity weights",
    kind: "numberList",
  },
  {
    id: "independentFrictionTemperatureRiseC",
    label: "Independent friction temperature rise c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIngredientThermalCapacityWeights.forEach((v) =>
    positive(v, "callerIngredientThermalCapacityWeights"),
  );
  nonnegative(
    input.independentFrictionTemperatureRiseC,
    "independentFrictionTemperatureRiseC",
  );
  aligned(
    input.observedIngredientTemperaturesC,
    input.callerIngredientThermalCapacityWeights,
    "observedIngredientTemperaturesC",
  );
  const w = weights(input.callerIngredientThermalCapacityWeights);
  return {
    conditionalDoughTemperatureC:
      sum(input.observedIngredientTemperaturesC.map((t, i) => t * w[i])) +
      input.independentFrictionTemperatureRiseC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIngredientTemperaturesC: [20, 30],
  callerIngredientThermalCapacityWeights: [1, 3],
  independentFrictionTemperatureRiseC: 2,
} satisfies Input;
export const exampleOutput = {
  conditionalDoughTemperatureC: 29.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/dough-temperature",
  title: "Cooking Dough Temperature Calculator",
  description:
    "Declared heat-capacity-weighted dough mixing temperature plus independent friction rise, not arbitrary three-temperature average or actual fermentation forecast. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalDoughTemperatureC",
      label: "Conditional dough temperature c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIngredientTemperaturesC:
        value.observedIngredientTemperaturesC as readonly number[],
      callerIngredientThermalCapacityWeights:
        value.callerIngredientThermalCapacityWeights as readonly number[],
      independentFrictionTemperatureRiseC:
        value.independentFrictionTemperatureRiseC as number,
    }),
});
export const run = tool.execute;
export default tool;
