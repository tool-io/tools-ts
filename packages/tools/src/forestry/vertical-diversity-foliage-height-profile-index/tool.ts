import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sum,
  weights,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedFoliageAreaByHeightBin: readonly number[];
}>;
export type Output = Readonly<{
  readonly shannonVerticalFoliageDiversity: number;
  readonly effectiveOccupiedHeightBins: number;
}>;
const inputFields = [
  {
    id: "observedFoliageAreaByHeightBin",
    label: "Observed foliage area by height bin",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFoliageAreaByHeightBin.forEach((v) =>
    nonnegative(v, "observedFoliageAreaByHeightBin"),
  );
  const w = weights(input.observedFoliageAreaByHeightBin),
    h = -sum(w.map((v) => (v === 0 ? 0 : v * Math.log(v))));
  return {
    shannonVerticalFoliageDiversity: h,
    effectiveOccupiedHeightBins: Math.exp(h),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFoliageAreaByHeightBin: [1, 1, 2],
} satisfies Input;
export const exampleOutput = {
  shannonVerticalFoliageDiversity: 1.0397207708399179,
  effectiveOccupiedHeightBins: 2.82842712474619,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/vertical-diversity-foliage-height-profile-index",
  title: "Foliage Height Diversity Index Calculator",
  description:
    "Compute natural-log Shannon vertical foliage-area profile diversity and effective bins, caller equal/protocol matched height bins; not LAI or species diversity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "shannonVerticalFoliageDiversity",
      label: "Shannon vertical foliage diversity",
      kind: "number",
    },
    {
      id: "effectiveOccupiedHeightBins",
      label: "Effective occupied height bins",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFoliageAreaByHeightBin:
        value.observedFoliageAreaByHeightBin as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
