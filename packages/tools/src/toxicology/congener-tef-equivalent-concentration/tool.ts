import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly congenerConcentrations: readonly number[];
  readonly toxicEquivalencyFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly congenerEquivalentConcentrations: readonly number[];
  readonly totalEquivalentConcentration: number;
}>;
const inputFields = [
  {
    id: "congenerConcentrations",
    label: "Congener concentrations",
    kind: "numberList",
  },
  {
    id: "toxicEquivalencyFactors",
    label: "Toxic equivalency factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.congenerConcentrations,
    input.toxicEquivalencyFactors,
    "congenerConcentrations",
  );
  input.congenerConcentrations.forEach((v) =>
    nonnegative(v, "congenerConcentrations"),
  );
  input.toxicEquivalencyFactors.forEach((v) =>
    nonnegative(v, "toxicEquivalencyFactors"),
  );
  const congenerEquivalentConcentrations = input.congenerConcentrations.map(
    (v, i) => v * input.toxicEquivalencyFactors[i],
  );
  return {
    congenerEquivalentConcentrations,
    totalEquivalentConcentration: congenerEquivalentConcentrations.reduce(
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
  congenerConcentrations: [2, 3],
  toxicEquivalencyFactors: [1, 0.1],
} satisfies Input;
export const exampleOutput = {
  congenerEquivalentConcentrations: [2, 0.3],
  totalEquivalentConcentration: 2.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/congener-tef-equivalent-concentration",
  title: "TEF to TEQ Converter",
  description:
    "Calculate congener-specific and total reference-equivalent concentration using caller TEFs; all concentrations share one basis and no changing regulatory TEF table is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "congenerEquivalentConcentrations",
      label: "Congener equivalent concentrations",
      kind: "numberList",
    },
    {
      id: "totalEquivalentConcentration",
      label: "Total equivalent concentration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      congenerConcentrations: value.congenerConcentrations as readonly number[],
      toxicEquivalencyFactors:
        value.toxicEquivalencyFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
