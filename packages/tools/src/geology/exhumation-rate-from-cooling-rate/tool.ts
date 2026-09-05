import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentCoolingRatesCPerMa: readonly number[];
  readonly independentGeothermalGradientsCPerKm: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentExhumationKmPerMa: readonly number[];
}>;
const inputFields = [
  {
    id: "independentCoolingRatesCPerMa",
    label: "Independent cooling rates c per ma",
    kind: "numberList",
  },
  {
    id: "independentGeothermalGradientsCPerKm",
    label: "Independent geothermal gradients c per km",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentGeothermalGradientsCPerKm.forEach((v) =>
    positive(v, "independentGeothermalGradientsCPerKm"),
  );
  aligned(
    input.independentCoolingRatesCPerMa,
    input.independentGeothermalGradientsCPerKm,
    "independentCoolingRatesCPerMa",
  );
  return {
    apparentExhumationKmPerMa: input.independentCoolingRatesCPerMa.map(
      (v, i) => v / input.independentGeothermalGradientsCPerKm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentCoolingRatesCPerMa: [10, -5],
  independentGeothermalGradientsCPerKm: [20, 25],
} satisfies Input;
export const exampleOutput = {
  apparentExhumationKmPerMa: [0.5, -0.2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/exhumation-rate-from-cooling-rate",
  title: "Geology Exhumation Rate From Cooling Rate Calculator",
  description:
    "Conditional cooling/gradient apparent exhumation, signed heating/subsidence retained; caller assumes stationary gradient and no independent transient thermal change. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentExhumationKmPerMa",
      label: "Apparent exhumation km per ma",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      independentCoolingRatesCPerMa:
        value.independentCoolingRatesCPerMa as readonly number[],
      independentGeothermalGradientsCPerKm:
        value.independentGeothermalGradientsCPerKm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
