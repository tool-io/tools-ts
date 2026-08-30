import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, crossing } from "../shared.js";
export type Input = Readonly<{
  readonly elevationsM: readonly number[];
  readonly netBalancesMwe: readonly number[];
}>;
export type Output = Readonly<{ readonly interpolatedElaM: number }>;
const inputFields = [
  { id: "elevationsM", label: "Elevations m", kind: "numberList" },
  { id: "netBalancesMwe", label: "Net balances mwe", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    interpolatedElaM: crossing(input.elevationsM, input.netBalancesMwe, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elevationsM: [1000, 1500, 2000],
  netBalancesMwe: [-1, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  interpolatedElaM: 1333.3333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/equilibrium-line-altitude-ela",
  title: "Equilibrium Line Altitude ELA",
  description:
    "Find the unique observed zero of a piecewise-linear altitude/net-balance profile; missing and multiple equilibrium lines are not extrapolated or arbitrarily selected.",
  inputs: inputFields,
  outputs: [
    { id: "interpolatedElaM", label: "Interpolated ela m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      elevationsM: value.elevationsM as readonly number[],
      netBalancesMwe: value.netBalancesMwe as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
