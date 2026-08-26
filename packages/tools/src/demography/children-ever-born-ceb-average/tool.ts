import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChildrenEverBornCebAverageInput = {
  readonly womenByParity?: readonly number[];
  readonly totalChildrenBorn?: number;
  readonly totalWomen?: number;
};

export type ChildrenEverBornCebAverageOutput = {
  readonly averageChildrenEverBorn: number;
};

export const calculateChildrenEverBornCebAverage = (
  input: ChildrenEverBornCebAverageInput,
): ChildrenEverBornCebAverageOutput => {
  const counts = input.womenByParity ?? [];
  if (counts.length > 0) {
    for (const value of counts)
      if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
        simpleError(
          "womenByParity",
          "Parity counts must be finite and non-negative.",
          "invalid_list",
        );
    let women = 0;
    let children = 0;
    for (let index = 0; index < counts.length; index += 1) {
      women += counts[index]!;
      children += index * counts[index]!;
    }
    if (!(women > 0))
      simpleError(
        "womenByParity",
        "The total number of women must be positive.",
        "invalid_list",
      );
    return { averageChildrenEverBorn: children / women };
  }
  const totalWomen = input.totalWomen ?? 0;
  const totalChildrenBorn = input.totalChildrenBorn ?? 0;
  if (!(totalWomen > 0))
    simpleError(
      "totalWomen",
      "Provide a parity list or a positive aggregate number of women.",
      "invalid_list",
    );
  if (!(totalChildrenBorn >= 0))
    simpleError(
      "totalChildrenBorn",
      "Total children born must be non-negative.",
      "invalid_births",
    );
  return { averageChildrenEverBorn: totalChildrenBorn / totalWomen };
};

export const childrenEverBornCebAverageExample = {
  input: { womenByParity: [100, 60, 30, 10] },
  output: { averageChildrenEverBorn: 0.75 },
} satisfies ToolExample<
  ChildrenEverBornCebAverageInput,
  ChildrenEverBornCebAverageOutput
>;

export const childrenEverBornCebAverageTool = createSimpleTool({
  id: "demography/children-ever-born-ceb-average",
  title: "Children Ever Born CEB Average Calculator",
  description:
    "Compute mean parity as average children ever born either from a full parity distribution or from aggregate totals of children born and women.",
  inputs: [
    {
      default: [],
      description:
        "Number of women at each parity starting with parity zero; preferred when available.",
      id: "womenByParity",
      kind: "numberList",
      label: "Women by parity",
    },
    {
      default: 0,
      description: "Aggregate children ever born (aggregate path).",
      id: "totalChildrenBorn",
      kind: "number",
      label: "Total CEB",
      minimum: 0,
    },
    {
      default: 0,
      description: "Aggregate number of women (aggregate path).",
      id: "totalWomen",
      kind: "number",
      label: "Total women",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Mean children ever born per woman.",
      id: "averageChildrenEverBorn",
      kind: "number",
      label: "Mean CEB",
    },
  ],
  calculate: (input) =>
    calculateChildrenEverBornCebAverage(
      input as unknown as ChildrenEverBornCebAverageInput,
    ),
});

export const runChildrenEverBornCebAverage =
  childrenEverBornCebAverageTool.execute;
export default childrenEverBornCebAverageTool;
