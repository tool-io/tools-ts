import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly groupOne: readonly number[];
  readonly groupTwo: readonly number[];
}>;
export type Output = Readonly<{
  readonly rankSum: number;
  readonly uStatistic: number;
  readonly groupOneSize: number;
  readonly groupTwoSize: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.groupOne.length === 0 || input.groupTwo.length === 0)
    simpleError("groupOne", "Both groups must contain observations.");
  const combined = [
    ...input.groupOne.map((v) => ({ v, g: 1 })),
    ...input.groupTwo.map((v) => ({ v, g: 2 })),
  ].sort((a, b) => a.v - b.v);
  let rankSum = 0;
  for (let i = 0; i < combined.length;) {
    let j = i + 1;
    while (j < combined.length && combined[j].v === combined[i].v) j++;
    const rank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) if (combined[k].g === 1) rankSum += rank;
    i = j;
  }
  const groupOneSize = input.groupOne.length,
    groupTwoSize = input.groupTwo.length;
  return {
    rankSum,
    uStatistic: rankSum - (groupOneSize * (groupOneSize + 1)) / 2,
    groupOneSize,
    groupTwoSize,
  };
};

export const exampleInput = {
  groupOne: [1, 2],
  groupTwo: [3, 4],
} satisfies Input;
export const exampleOutput = {
  rankSum: 3,
  uStatistic: 0,
  groupOneSize: 2,
  groupTwoSize: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/wilcoxon-rank-sum",
  title: "Wilcoxon Rank Sum",
  description:
    "Calculate a two-group Wilcoxon rank-sum statistic with averaged tied ranks.",
  inputs: [
    { id: "groupOne", kind: "numberList", label: "Group one" },
    { id: "groupTwo", kind: "numberList", label: "Group two" },
  ],
  outputs: [
    { id: "rankSum", kind: "number", label: "Rank sum" },
    { id: "uStatistic", kind: "number", label: "U statistic" },
    { id: "groupOneSize", kind: "number", label: "Group one size" },
    { id: "groupTwoSize", kind: "number", label: "Group two size" },
  ],
  calculate: (value) =>
    calculate({
      groupOne: value.groupOne as readonly number[],
      groupTwo: value.groupTwo as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
