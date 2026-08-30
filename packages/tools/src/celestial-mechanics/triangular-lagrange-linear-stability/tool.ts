import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction } from "../shared.js";

export type Input = Readonly<{
  readonly smallerMassFraction: number;
}>;
export type Output = Readonly<{
  readonly routhProduct: number;
  readonly criticalSmallerMassFraction: number;
  readonly linearlyStable: boolean;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.smallerMassFraction, "smallerMassFraction");
  if (input.smallerMassFraction <= 0 || input.smallerMassFraction > 0.5)
    simpleError(
      "smallerMassFraction",
      "Smaller-primary fraction must lie in (0,0.5].",
    );
  const routhProduct =
    input.smallerMassFraction * (1 - input.smallerMassFraction);
  return {
    routhProduct,
    criticalSmallerMassFraction: (1 - Math.sqrt(23 / 27)) / 2,
    linearlyStable: routhProduct < 1 / 27,
  };
};
export const exampleInput = { smallerMassFraction: 0.01 } satisfies Input;
export const exampleOutput = {
  routhProduct: 0.0099,
  criticalSmallerMassFraction: 0.03852089650455137,
  linearlyStable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/triangular-lagrange-linear-stability",
  title: "Triangular Lagrange Linear Stability",
  description:
    "Evaluate the Routh criterion μ(1−μ)<1/27 for linear L4/L5 stability in the planar circular restricted model.",
  inputs: [
    {
      id: "smallerMassFraction",
      label: "Smaller mass fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "routhProduct", label: "Routh product", kind: "number" },
    {
      id: "criticalSmallerMassFraction",
      label: "Critical smaller mass fraction",
      kind: "number",
    },
    { id: "linearlyStable", label: "Linearly stable", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      smallerMassFraction: value.smallerMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
