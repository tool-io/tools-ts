import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly toothOnlyMarkedBoneCount: number;
  readonly toolOnlyMarkedBoneCount: number;
  readonly bothMarkedBoneCount: number;
  readonly unmarkedObservableBoneCount: number;
}>;
export type Output = Readonly<{
  readonly toothMarkedObservableBoneFraction: number;
  readonly toolMarkedObservableBoneFraction: number;
  readonly toothToToolMarkedBoneRatio: number;
  readonly coMarkedObservableBoneFraction: number;
}>;
const inputFields = [
  {
    id: "toothOnlyMarkedBoneCount",
    label: "Tooth only marked bone count",
    kind: "integer",
  },
  {
    id: "toolOnlyMarkedBoneCount",
    label: "Tool only marked bone count",
    kind: "integer",
  },
  {
    id: "bothMarkedBoneCount",
    label: "Both marked bone count",
    kind: "integer",
  },
  {
    id: "unmarkedObservableBoneCount",
    label: "Unmarked observable bone count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.toothOnlyMarkedBoneCount, "toothOnlyMarkedBoneCount");
  count(input.toolOnlyMarkedBoneCount, "toolOnlyMarkedBoneCount");
  count(input.bothMarkedBoneCount, "bothMarkedBoneCount");
  count(input.unmarkedObservableBoneCount, "unmarkedObservableBoneCount");
  const tooth = input.toothOnlyMarkedBoneCount + input.bothMarkedBoneCount,
    tool = positive(
      input.toolOnlyMarkedBoneCount + input.bothMarkedBoneCount,
      "toolMarked",
    ),
    n =
      tooth + input.toolOnlyMarkedBoneCount + input.unmarkedObservableBoneCount;
  return {
    toothMarkedObservableBoneFraction: tooth / n,
    toolMarkedObservableBoneFraction: tool / n,
    toothToToolMarkedBoneRatio: tooth / tool,
    coMarkedObservableBoneFraction: input.bothMarkedBoneCount / n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  toothOnlyMarkedBoneCount: 2,
  toolOnlyMarkedBoneCount: 4,
  bothMarkedBoneCount: 2,
  unmarkedObservableBoneCount: 2,
} satisfies Input;
export const exampleOutput = {
  toothMarkedObservableBoneFraction: 0.4,
  toolMarkedObservableBoneFraction: 0.6,
  toothToToolMarkedBoneRatio: 0.6666666666666666,
  coMarkedObservableBoneFraction: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/tooth-tool-mark-ratio",
  title: "Tooth Mark to Tool Mark Ratio Checker",
  description:
    "Compare caller classified tooth/tool-marked bone prevalence with co-marked overlap retained; observed-bone ratios do not determine predator/human sequence or agents.",
  inputs: inputFields,
  outputs: [
    {
      id: "toothMarkedObservableBoneFraction",
      label: "Tooth marked observable bone fraction",
      kind: "number",
    },
    {
      id: "toolMarkedObservableBoneFraction",
      label: "Tool marked observable bone fraction",
      kind: "number",
    },
    {
      id: "toothToToolMarkedBoneRatio",
      label: "Tooth to tool marked bone ratio",
      kind: "number",
    },
    {
      id: "coMarkedObservableBoneFraction",
      label: "Co marked observable bone fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      toothOnlyMarkedBoneCount: value.toothOnlyMarkedBoneCount as number,
      toolOnlyMarkedBoneCount: value.toolOnlyMarkedBoneCount as number,
      bothMarkedBoneCount: value.bothMarkedBoneCount as number,
      unmarkedObservableBoneCount: value.unmarkedObservableBoneCount as number,
    }),
});
export const run = tool.execute;
export default tool;
