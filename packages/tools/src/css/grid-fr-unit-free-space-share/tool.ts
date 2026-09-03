import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly definiteContainerPx: number;
  readonly nonFlexibleTrackTotalPx: number;
  readonly explicitGapTotalPx: number;
  readonly flexTrackFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly initialFrSharesPx: readonly number[];
  readonly unallocatedFreeSpacePx: number;
}>;
const inputFields = [
  { id: "definiteContainerPx", label: "Definite container px", kind: "number" },
  {
    id: "nonFlexibleTrackTotalPx",
    label: "Non flexible track total px",
    kind: "number",
  },
  { id: "explicitGapTotalPx", label: "Explicit gap total px", kind: "number" },
  { id: "flexTrackFactors", label: "Flex track factors", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.definiteContainerPx, "definiteContainerPx");
  nonnegative(input.nonFlexibleTrackTotalPx, "nonFlexibleTrackTotalPx");
  nonnegative(input.explicitGapTotalPx, "explicitGapTotalPx");
  input.flexTrackFactors.forEach((v) => nonnegative(v, "flexTrackFactors"));
  if (!input.flexTrackFactors.length)
    simpleError("tracks", "Explicit flexible tracks.");
  const space = Math.max(
      0,
      input.definiteContainerPx -
        input.nonFlexibleTrackTotalPx -
        input.explicitGapTotalPx,
    ),
    total = sum(input.flexTrackFactors),
    div = Math.max(1, total),
    shares = input.flexTrackFactors.map((v) => (space * v) / div);
  return {
    initialFrSharesPx: shares,
    unallocatedFreeSpacePx: space - sum(shares),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  definiteContainerPx: 100,
  nonFlexibleTrackTotalPx: 20,
  explicitGapTotalPx: 10,
  flexTrackFactors: [1, 2],
} satisfies Input;
export const exampleOutput = {
  initialFrSharesPx: [23.333333333333332, 46.666666666666664],
  unallocatedFreeSpacePx: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/grid-fr-unit-free-space-share",
  title: "Grid fr Free-Space Share Calculator",
  description:
    "Definite-container initial fr allocation after fixed tracks/gaps, sumfr<1 partial filling retained; minimum-track intrinsic sizing/freeze algorithm excluded. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "initialFrSharesPx",
      label: "Initial fr shares px",
      kind: "numberList",
    },
    {
      id: "unallocatedFreeSpacePx",
      label: "Unallocated free space px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      definiteContainerPx: value.definiteContainerPx as number,
      nonFlexibleTrackTotalPx: value.nonFlexibleTrackTotalPx as number,
      explicitGapTotalPx: value.explicitGapTotalPx as number,
      flexTrackFactors: value.flexTrackFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
