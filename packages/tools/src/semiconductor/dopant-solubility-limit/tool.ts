import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSolubilityKelvin: readonly number[];
  readonly observedMatchedEquilibriumSolubilityPerM3: readonly number[];
  readonly queryTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly interpolatedDopantSolubilityPerM3: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedSolubilityKelvin",
    label: "Observed solubility kelvin",
    kind: "numberList",
  },
  {
    id: "observedMatchedEquilibriumSolubilityPerM3",
    label: "Observed matched equilibrium solubility per m3",
    kind: "numberList",
  },
  {
    id: "queryTemperatureKelvin",
    label: "Query temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedEquilibriumSolubilityPerM3.forEach((v) =>
    positive(v, "observedMatchedEquilibriumSolubilityPerM3"),
  );
  input.observedSolubilityKelvin.forEach((v) =>
    nonnegative(v, "observedSolubilityKelvin"),
  );
  nonnegative(input.queryTemperatureKelvin, "queryTemperatureKelvin");
  const result = curve(
    input.observedSolubilityKelvin,
    input.observedMatchedEquilibriumSolubilityPerM3,
    input.queryTemperatureKelvin,
  );
  return {
    interpolatedDopantSolubilityPerM3: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSolubilityKelvin: [1, 2, 3],
  observedMatchedEquilibriumSolubilityPerM3: [2, 4, 8],
  queryTemperatureKelvin: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedDopantSolubilityPerM3: 6,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/dopant-solubility-limit",
  title: "Semiconductor Dopant Solubility Limit Calculator",
  description:
    "Read actual independently verified equilibrium dopant-solubility assay versus temperature, no inferred activation fraction or diffusion coefficient. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedDopantSolubilityPerM3",
      label: "Interpolated dopant solubility per m3",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSolubilityKelvin:
        value.observedSolubilityKelvin as readonly number[],
      observedMatchedEquilibriumSolubilityPerM3:
        value.observedMatchedEquilibriumSolubilityPerM3 as readonly number[],
      queryTemperatureKelvin: value.queryTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
