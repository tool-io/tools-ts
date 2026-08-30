import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly calciumMolPerKg: number;
  readonly carbonateMolPerKg: number;
  readonly calciumActivityCoefficient: number;
  readonly carbonateActivityCoefficient: number;
  readonly consistentAragoniteSolubilityProduct: number;
}>;
export type Output = Readonly<{
  readonly aragoniteSaturationState: number;
  readonly belowEquilibriumSaturation: boolean;
}>;
const inputFields = [
  { id: "calciumMolPerKg", label: "Calcium mol per kg", kind: "number" },
  { id: "carbonateMolPerKg", label: "Carbonate mol per kg", kind: "number" },
  {
    id: "calciumActivityCoefficient",
    label: "Calcium activity coefficient",
    kind: "number",
  },
  {
    id: "carbonateActivityCoefficient",
    label: "Carbonate activity coefficient",
    kind: "number",
  },
  {
    id: "consistentAragoniteSolubilityProduct",
    label: "Consistent aragonite solubility product",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.calciumActivityCoefficient, "calciumActivityCoefficient");
  positive(input.carbonateActivityCoefficient, "carbonateActivityCoefficient");
  positive(
    input.consistentAragoniteSolubilityProduct,
    "consistentAragoniteSolubilityProduct",
  );
  nonnegative(input.calciumMolPerKg, "calciumMolPerKg");
  nonnegative(input.carbonateMolPerKg, "carbonateMolPerKg");
  const aragoniteSaturationState =
    (input.calciumMolPerKg *
      input.carbonateMolPerKg *
      input.calciumActivityCoefficient *
      input.carbonateActivityCoefficient) /
    input.consistentAragoniteSolubilityProduct;
  return {
    aragoniteSaturationState,
    belowEquilibriumSaturation: aragoniteSaturationState < 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calciumMolPerKg: 0.01,
  carbonateMolPerKg: 0.0002,
  calciumActivityCoefficient: 0.5,
  carbonateActivityCoefficient: 0.5,
  consistentAragoniteSolubilityProduct: 1e-6,
} satisfies Input;
export const exampleOutput = {
  aragoniteSaturationState: 0.5,
  belowEquilibriumSaturation: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/omega-aragonite-carbonate-state",
  title: "Omega Aragonite Carbonate State",
  description:
    "Calculate aragonite ion-activity saturation on a caller consistent molal/activity Ksp convention; conditional seawater concentration Ksp must not be mixed with separate activity corrections.",
  inputs: inputFields,
  outputs: [
    {
      id: "aragoniteSaturationState",
      label: "Aragonite saturation state",
      kind: "number",
    },
    {
      id: "belowEquilibriumSaturation",
      label: "Below equilibrium saturation",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      calciumMolPerKg: value.calciumMolPerKg as number,
      carbonateMolPerKg: value.carbonateMolPerKg as number,
      calciumActivityCoefficient: value.calciumActivityCoefficient as number,
      carbonateActivityCoefficient:
        value.carbonateActivityCoefficient as number,
      consistentAragoniteSolubilityProduct:
        value.consistentAragoniteSolubilityProduct as number,
    }),
});
export const run = tool.execute;
export default tool;
