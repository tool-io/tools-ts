import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  averageRanks,
  finiteGroups,
  isRecord,
  roundStatistic,
  tieTerm,
} from "../input.js";

export type KruskalWallisInput = {
  readonly groups: readonly (readonly number[])[];
};
export type KruskalWallisOutput = {
  readonly degreesOfFreedom: number;
  readonly groupRankSums: readonly number[];
  readonly statistic: number;
};

export const kruskalWallisExample = {
  input: {
    groups: [
      [1, 2],
      [3, 4],
    ],
  },
} satisfies ToolExample<KruskalWallisInput>;

export const calculateKruskalWallis = (
  input: unknown,
): ToolResult<KruskalWallisOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const groups = finiteGroups(input.groups);
  if (
    !groups ||
    groups.length < 2 ||
    groups.some((group) => group.length === 0)
  )
    return invalidInput([
      {
        code: "groups_required",
        field: "groups",
        message: "Provide at least two non-empty groups of finite numbers.",
      },
    ]);
  const combined = groups.flat();
  const ranks = averageRanks(combined);
  const total = combined.length;
  const groupRankSums: number[] = [];
  let offset = 0;
  for (const group of groups) {
    groupRankSums.push(
      ranks
        .slice(offset, offset + group.length)
        .reduce((sum, rank) => sum + rank, 0),
    );
    offset += group.length;
  }
  const uncorrected =
    (12 / (total * (total + 1))) *
      groupRankSums.reduce(
        (sum, rankSum, index) => sum + rankSum ** 2 / groups[index]!.length,
        0,
      ) -
    3 * (total + 1);
  const correction = 1 - tieTerm(combined) / (total ** 3 - total);
  const statistic = correction === 0 ? Number.NaN : uncorrected / correction;
  if (!Number.isFinite(statistic))
    return invalidInput([
      {
        code: "undefined_statistic",
        field: "groups",
        message: "The statistic is undefined when every observation is tied.",
      },
    ]);
  return toolSuccess({
    degreesOfFreedom: groups.length - 1,
    groupRankSums: groupRankSums.map(roundStatistic),
    statistic: roundStatistic(statistic),
  });
};
export const kruskalWallisTool = defineTool<
  KruskalWallisInput,
  KruskalWallisOutput
>({
  contractVersion: 1,
  description:
    "Calculate the tie-corrected Kruskal-Wallis H statistic for independent groups.",
  execute: calculateKruskalWallis,
  execution: { kind: "pure" },
  id: "statistics/kruskal-wallis",
  inputSchema: {
    additionalProperties: false,
    properties: {
      groups: {
        items: { items: { type: "number" }, minItems: 1, type: "array" },
        minItems: 2,
        type: "array",
      },
    },
    required: ["groups"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      degreesOfFreedom: { minimum: 1, type: "integer" },
      groupRankSums: { items: { minimum: 0, type: "number" }, type: "array" },
      statistic: { minimum: 0, type: "number" },
    },
    required: ["degreesOfFreedom", "groupRankSums", "statistic"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "groups",
        label: "Groups",
        required: true,
        valueType: {
          items: { items: { type: "number" }, type: "list" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "statistic",
        label: "H statistic",
        path: ["statistic"],
        valueType: { format: "kruskal-wallis-h-statistic", type: "number" },
      },
    ],
  },
  title: "Kruskal-Wallis Test Calculator",
});
export default kruskalWallisTool;
