import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { derangement } from "../../math/derangement-number/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
  type GeneratorRandom,
} from "../generator-random.js";
import {
  snArray,
  snDistinct,
  snId,
  snObject,
} from "../m250-sampling-narrative-support.js";

export type DerangementAssignmentInput = {
  readonly ids: readonly string[];
  readonly seed?: number;
};
export type DerangementAssignmentOutput = {
  readonly assignments: readonly {
    readonly from: string;
    readonly to: string;
  }[];
  readonly cycles: readonly (readonly string[])[];
  readonly exactCount: string;
  readonly sampledRank: string;
  readonly randomness: GeneratorReplay;
};
const decimal = { type: "string", pattern: "^(0|[1-9][0-9]*)$" } as const;
export const inputSchema = snObject(
  { ids: snArray(snId, 16, 2), seed: generatorSeedSchema },
  ["ids"],
);
export const outputSchema = snObject({
  assignments: snArray(snObject({ from: snId, to: snId }), 16, 2),
  cycles: snArray(snArray(snId, 16, 2), 8, 1),
  exactCount: decimal,
  sampledRank: decimal,
  randomness: generatorReplaySchema,
});
/** Exact range rejection, rather than multiplying a float by the solution count. */
const uniformRank = (count: bigint, random: GeneratorRandom): bigint => {
  if (count === 1n) return 0n;
  const bits = (count - 1n).toString(2).length,
    words = Math.ceil(bits / 32),
    mask = (1n << BigInt(bits)) - 1n;
  for (let attempt = 0; attempt < 128; attempt += 1) {
    let value = 0n;
    for (let i = 0; i < words; i += 1)
      value = (value << 32n) | BigInt(Math.floor(random.unit() * 4294967296));
    value &= mask;
    if (value < count) return value;
  }
  return simpleError(
    "random",
    "Rank rejection exceeded 128 attempts.",
    "random_rejection_limit",
  );
};
const isInput = (input: unknown): input is DerangementAssignmentInput =>
  matchesModelInput(input, inputSchema);
export const calculateDerangementAssignment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DerangementAssignmentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(input.ids, "ids");
    const n = input.ids.length,
      full = (1 << n) - 1,
      memo = new Map<number, bigint>();
    const completions = (mask: number, row: number): bigint => {
      if (mask === full) return 1n;
      const cached = memo.get(mask);
      if (cached !== undefined) return cached;
      let total = 0n;
      for (let column = 0; column < n; column += 1)
        if (column !== row && !(mask & (1 << column)))
          total += completions(mask | (1 << column), row + 1);
      memo.set(mask, total);
      return total;
    };
    const count = completions(0, 0);
    if (count !== derangement(n))
      throw new Error(
        "Subset completion count disagrees with the independent derangement recurrence.",
      );
    const random = createGeneratorRandom(input.seed, context),
      originalRank = uniformRank(count, random);
    let rank = originalRank,
      mask = 0;
    const targets: number[] = [];
    for (let row = 0; row < n; row += 1) {
      let selected = -1;
      for (let column = 0; column < n; column += 1) {
        if (column === row || mask & (1 << column)) continue;
        const block = completions(mask | (1 << column), row + 1);
        if (rank < block) {
          selected = column;
          break;
        }
        rank -= block;
      }
      if (selected < 0)
        throw new Error("A valid derangement rank failed to unrank.");
      targets.push(selected);
      mask |= 1 << selected;
    }
    const visited = new Set<number>(),
      cycles: string[][] = [];
    for (let start = 0; start < n; start += 1) {
      if (visited.has(start)) continue;
      const cycle: string[] = [];
      let cursor = start;
      do {
        cycle.push(input.ids[cursor]);
        visited.add(cursor);
        cursor = targets[cursor];
      } while (cursor !== start);
      cycles.push(cycle);
    }
    return toolSuccess({
      assignments: targets.map((target, i) => ({
        from: input.ids[i],
        to: input.ids[target],
      })),
      cycles,
      exactCount: count.toString(),
      sampledRank: originalRank.toString(),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const derangementAssignmentExample = {
  input: { ids: ["A", "B", "C", "D"], seed: 42 },
  output: {
    assignments: [
      { from: "A", to: "B" },
      { from: "B", to: "A" },
      { from: "C", to: "D" },
      { from: "D", to: "C" },
    ],
    cycles: [
      ["A", "B"],
      ["C", "D"],
    ],
    exactCount: "9",
    sampledRank: "0",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  DerangementAssignmentInput,
  DerangementAssignmentOutput
>;
export const derangementAssignmentTool = createModelDefinition<
  DerangementAssignmentInput,
  DerangementAssignmentOutput
>({
  id: "random/derangement-assignment",
  title: "Random Derangement Assignment Generator",
  description:
    "Construct a no-fixed-point assignment by exact completion-count unranking, uniformly over all derangements under independent uniform random words.",
  inputSchema,
  outputSchema,
  execute: calculateDerangementAssignment,
});
export const runDerangementAssignment = derangementAssignmentTool.execute;
export default derangementAssignmentTool;
