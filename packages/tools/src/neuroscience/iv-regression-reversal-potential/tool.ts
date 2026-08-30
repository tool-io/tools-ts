import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, regression } from "../shared.js";
export type Input = Readonly<{
  readonly holdingPotentialsMv: readonly number[];
  readonly synapticCurrentsPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly slopeConductanceNs: number;
  readonly reversalPotentialMv: number;
  readonly ivRSquared: number;
}>;
const inputFields = [
  {
    id: "holdingPotentialsMv",
    label: "Holding potentials mv",
    kind: "numberList",
  },
  {
    id: "synapticCurrentsPa",
    label: "Synaptic currents pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const fit = regression(input.holdingPotentialsMv, input.synapticCurrentsPa);
  positive(fit.slope, "synapticCurrentsPa");
  return {
    slopeConductanceNs: fit.slope,
    reversalPotentialMv: -fit.intercept / fit.slope,
    ivRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  holdingPotentialsMv: [-80, -60, -40],
  synapticCurrentsPa: [-40, 0, 40],
} satisfies Input;
export const exampleOutput = {
  slopeConductanceNs: 2,
  reversalPotentialMv: -60,
  ivRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/iv-regression-reversal-potential",
  title: "Reversal Potential",
  description:
    "Estimate synaptic reversal potential from a linear leak-subtracted I–V regression, rather than an ion-concentration Nernst calculation.",
  inputs: inputFields,
  outputs: [
    { id: "slopeConductanceNs", label: "Slope conductance ns", kind: "number" },
    {
      id: "reversalPotentialMv",
      label: "Reversal potential mv",
      kind: "number",
    },
    { id: "ivRSquared", label: "Iv r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      holdingPotentialsMv: value.holdingPotentialsMv as readonly number[],
      synapticCurrentsPa: value.synapticCurrentsPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
