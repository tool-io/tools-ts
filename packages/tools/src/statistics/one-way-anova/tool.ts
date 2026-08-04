import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OneWayAnovaOutput = {
  readonly betweenDegreesOfFreedom: number;
  readonly betweenSumSquares: number;
  readonly fRatio: number;
  readonly grandMean: number;
  readonly groupMeans: readonly number[];
  readonly withinDegreesOfFreedom: number;
  readonly withinSumSquares: number;
};

const round = (value: number): number => Number(value.toPrecision(12));

export const calculateOneWayAnova = (
  groups: readonly (readonly number[])[],
): OneWayAnovaOutput | null => {
  if (
    groups.length < 2 ||
    groups.some((group) => group.length < 2 || !group.every(Number.isFinite))
  )
    return null;

  const count = groups.reduce((sum, group) => sum + group.length, 0);
  const groupMeans = groups.map(
    (group) => group.reduce((sum, value) => sum + value, 0) / group.length,
  );
  const grandMean =
    groups.flat().reduce((sum, value) => sum + value, 0) / count;
  if (!groupMeans.every(Number.isFinite) || !Number.isFinite(grandMean))
    return null;

  const betweenSumSquares = groups.reduce(
    (sum, group, index) =>
      sum + group.length * (groupMeans[index]! - grandMean) ** 2,
    0,
  );
  const withinSumSquares = groups.reduce(
    (sum, group, index) =>
      sum +
      group.reduce(
        (inner, value) => inner + (value - groupMeans[index]!) ** 2,
        0,
      ),
    0,
  );
  const betweenDegreesOfFreedom = groups.length - 1;
  const withinDegreesOfFreedom = count - groups.length;
  const fRatio =
    withinSumSquares === 0
      ? betweenSumSquares === 0
        ? 0
        : Number.POSITIVE_INFINITY
      : betweenSumSquares /
        betweenDegreesOfFreedom /
        (withinSumSquares / withinDegreesOfFreedom);
  if (
    !Number.isFinite(betweenSumSquares) ||
    !Number.isFinite(withinSumSquares) ||
    !Number.isFinite(fRatio)
  )
    return null;

  return {
    betweenDegreesOfFreedom,
    betweenSumSquares: round(betweenSumSquares),
    fRatio: round(fRatio),
    grandMean: round(grandMean),
    groupMeans: groupMeans.map(round),
    withinDegreesOfFreedom,
    withinSumSquares: round(withinSumSquares),
  };
};

export const oneWayAnovaExample = {
  input: {
    groups: [
      [5, 6, 7],
      [8, 9, 10],
      [4, 5, 6],
    ],
  },
} satisfies ToolExample<{
  readonly groups: readonly (readonly number[])[];
}>;

export const oneWayAnovaTool = createSimpleTool({
  id: "statistics/one-way-anova",
  title: "One-Way ANOVA F-Ratio Calculator",
  description:
    "Compare variation between two or more independent groups with a one-way ANOVA F-ratio.",
  inputs: [
    {
      format: "numeric-groups",
      id: "groups",
      kind: "matrix",
      label: "Groups",
    },
  ],
  outputs: [
    { id: "fRatio", label: "F-ratio", kind: "number" },
    {
      id: "betweenDegreesOfFreedom",
      label: "Between-groups degrees of freedom",
      kind: "integer",
    },
    {
      id: "withinDegreesOfFreedom",
      label: "Within-groups degrees of freedom",
      kind: "integer",
    },
    {
      id: "betweenSumSquares",
      label: "Between-groups sum of squares",
      kind: "number",
    },
    {
      id: "withinSumSquares",
      label: "Within-groups sum of squares",
      kind: "number",
    },
    { id: "grandMean", label: "Grand mean", kind: "number" },
    { id: "groupMeans", label: "Group means", kind: "numberList" },
  ],
  calculate: (input) => {
    const result = calculateOneWayAnova(input.groups as number[][]);
    if (result === null)
      return simpleError(
        "groups",
        "Enter at least two finite groups with at least two values each and a finite F-ratio.",
      );
    return result;
  },
});

export const runOneWayAnova = oneWayAnovaTool.execute;
export default oneWayAnovaTool;
