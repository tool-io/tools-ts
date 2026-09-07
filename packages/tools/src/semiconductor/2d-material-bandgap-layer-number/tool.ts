import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observed2dLayerCounts: readonly number[];
  readonly observedDirectGapEv: readonly number[];
  readonly observedIndirectGapEv: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedFundamentalGapEv: readonly number[];
  readonly observedMinimumGapBranchIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observed2dLayerCounts",
    label: "Observed2d layer counts",
    kind: "numberList",
  },
  {
    id: "observedDirectGapEv",
    label: "Observed direct gap ev",
    kind: "numberList",
  },
  {
    id: "observedIndirectGapEv",
    label: "Observed indirect gap ev",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDirectGapEv.forEach((v) => positive(v, "observedDirectGapEv"));
  input.observedIndirectGapEv.forEach((v) =>
    positive(v, "observedIndirectGapEv"),
  );
  aligned(
    input.observed2dLayerCounts,
    input.observedDirectGapEv,
    "observed2dLayerCounts",
  );
  aligned(
    input.observed2dLayerCounts,
    input.observedIndirectGapEv,
    "observed2dLayerCounts",
  );
  strictlyIncreasing(input.observed2dLayerCounts, "layers", 1);
  input.observed2dLayerCounts.forEach((v) => bounded(v, "layers", 1, 1000));
  return {
    observedFundamentalGapEv: input.observedDirectGapEv.map((v, i) =>
      Math.min(v, input.observedIndirectGapEv[i]),
    ),
    observedMinimumGapBranchIds: input.observedDirectGapEv.map((v, i) =>
      v === input.observedIndirectGapEv[i]
        ? "degenerate"
        : v < input.observedIndirectGapEv[i]
          ? "direct"
          : "indirect",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observed2dLayerCounts: [1, 2, 3],
  observedDirectGapEv: [2, 1.8, 1.7],
  observedIndirectGapEv: [2.5, 1.5, 1.2],
} satisfies Input;
export const exampleOutput = {
  observedFundamentalGapEv: [2, 1.5, 1.2],
  observedMinimumGapBranchIds: ["direct", "indirect", "indirect"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/2d-material-bandgap-layer-number",
  title: "Semiconductor 2d Material Bandgap Layer Number Calculator",
  description:
    "Compare actual direct/indirect spectral gap branches per discrete 2D layer count, preserve equal minima; not universal semiconductor bandgap lookup or MoS2 single-branch layer table.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFundamentalGapEv",
      label: "Observed fundamental gap ev",
      kind: "numberList",
    },
    {
      id: "observedMinimumGapBranchIds",
      label: "Observed minimum gap branch ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observed2dLayerCounts: value.observed2dLayerCounts as readonly number[],
      observedDirectGapEv: value.observedDirectGapEv as readonly number[],
      observedIndirectGapEv: value.observedIndirectGapEv as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
