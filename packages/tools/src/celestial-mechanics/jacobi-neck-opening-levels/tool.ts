import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly jacobiConstant: number;
  readonly neckNames: readonly string[];
  readonly criticalJacobiValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly openNecks: readonly string[];
  readonly boundaryNecks: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.neckNames, input.criticalJacobiValues, "neckNames");
  if (new Set(input.neckNames).size !== input.neckNames.length)
    simpleError("neckNames", "Distinct neck labels required.");
  return {
    openNecks: input.neckNames.filter(
      (_, i) => input.jacobiConstant < input.criticalJacobiValues[i],
    ),
    boundaryNecks: input.neckNames.filter(
      (_, i) => input.jacobiConstant === input.criticalJacobiValues[i],
    ),
  };
};
export const exampleInput = {
  jacobiConstant: 3.3,
  neckNames: ["L1", "L2"],
  criticalJacobiValues: [3.5, 3.2],
} satisfies Input;
export const exampleOutput = {
  openNecks: ["L1"],
  boundaryNecks: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/jacobi-neck-opening-levels",
  title: "Jacobi Neck Opening Levels",
  description:
    "Compare a CR3BP Jacobi constant with supplied saddle-point levels; an energetically open neck does not guarantee transit.",
  inputs: [
    { id: "jacobiConstant", label: "Jacobi constant", kind: "number" },
    { id: "neckNames", label: "Neck names", kind: "stringList" },
    {
      id: "criticalJacobiValues",
      label: "Critical jacobi values",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "openNecks", label: "Open necks", kind: "stringList" },
    { id: "boundaryNecks", label: "Boundary necks", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      jacobiConstant: value.jacobiConstant as number,
      neckNames: value.neckNames as readonly string[],
      criticalJacobiValues: value.criticalJacobiValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
