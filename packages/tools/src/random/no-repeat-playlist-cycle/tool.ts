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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  snArray,
  snBoundOutput,
  snDistinct,
  snFrequencies,
  snId,
  snInteger,
  snObject,
  snText,
} from "../m250-sampling-narrative-support.js";

export type PlaylistContent = {
  readonly id: string;
  readonly category: string;
  readonly content: string;
};
export type NoRepeatPlaylistCycleInput = {
  readonly items: readonly PlaylistContent[];
  readonly count: number;
  readonly history: readonly string[];
  readonly itemCooldown: number;
  readonly categoryCooldown: number;
  readonly maxPlaysPerItem: number;
  readonly cyclePolicy: "exhaust-bank" | "cooldown";
  readonly feasibilityPolicy: "require-full" | "longest-prefix";
  readonly seed?: number;
};
export type NoRepeatPlaylistCycleOutput = {
  readonly playlist: readonly {
    readonly item: PlaylistContent;
    readonly cycle: number;
  }[];
  readonly complete: boolean;
  readonly frequencies: readonly {
    readonly itemId: string;
    readonly newPlays: number;
    readonly totalPlays: number;
  }[];
  readonly finalHistory: readonly string[];
  readonly randomness: GeneratorReplay;
};
const itemSchema = snObject({ id: snId, category: snId, content: snText });
export const inputSchema = snObject(
  {
    items: snArray(itemSchema, 32, 1),
    count: { type: "integer", minimum: 0, maximum: 64 },
    history: snArray(snId, 128),
    itemCooldown: { type: "integer", minimum: 0, maximum: 128 },
    categoryCooldown: { type: "integer", minimum: 0, maximum: 128 },
    maxPlaysPerItem: { type: "integer", minimum: 1 },
    cyclePolicy: { type: "string", enum: ["exhaust-bank", "cooldown"] },
    feasibilityPolicy: {
      type: "string",
      enum: ["require-full", "longest-prefix"],
      description:
        "Search all branches within 20000 visits; longest-prefix returns a proven longest prefix only after exhaustive search.",
    },
    seed: generatorSeedSchema,
  },
  [
    "items",
    "count",
    "history",
    "itemCooldown",
    "categoryCooldown",
    "maxPlaysPerItem",
    "cyclePolicy",
    "feasibilityPolicy",
  ],
);
export const outputSchema = snObject({
  playlist: snArray(snObject({ item: itemSchema, cycle: snInteger }), 64),
  complete: { type: "boolean" },
  frequencies: snArray(
    snObject({ itemId: snId, newPlays: snInteger, totalPlays: snInteger }),
    32,
    1,
  ),
  finalHistory: snArray(snId, 192),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is NoRepeatPlaylistCycleInput =>
  matchesModelInput(input, inputSchema);
export const calculateNoRepeatPlaylistCycle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NoRepeatPlaylistCycleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(
      input.items.map((item) => item.id),
      "items",
    );
    const byId = new Map(input.items.map((item, i) => [item.id, i]));
    const history = input.history.map((id) => {
      const index = byId.get(id);
      return index === undefined
        ? simpleError(
            "history",
            "History must use supplied item IDs.",
            "unknown_history_item",
          )
        : index;
    });
    const counts = input.items.map(
      (_, i) => history.filter((entry) => entry === i).length,
    );
    if (counts.some((count) => count > input.maxPlaysPerItem))
      simpleError(
        "history",
        "History exceeds a supplied total-play cap.",
        "invalid_history",
      );
    let initialUsed = new Set<number>(),
      initialCycle = 1;
    if (input.cyclePolicy === "exhaust-bank")
      for (const index of history) {
        if (initialUsed.size === input.items.length) {
          initialUsed = new Set();
          initialCycle += 1;
        }
        if (initialUsed.has(index))
          simpleError(
            "history",
            "History repeats an item before exhausting its cycle.",
            "invalid_history",
          );
        initialUsed.add(index);
      }
    // Historical cooldown violations are rejected, rather than silently treating them as valid state.
    for (let i = 0; i < history.length; i += 1) {
      const item = input.items[history[i]];
      if (
        history
          .slice(Math.max(0, i - input.itemCooldown), i)
          .includes(history[i]) ||
        history
          .slice(Math.max(0, i - input.categoryCooldown), i)
          .some((index) => input.items[index].category === item.category)
      )
        simpleError(
          "history",
          "History violates an item or category cooldown.",
          "invalid_history",
        );
    }
    const random = createGeneratorRandom(input.seed, context),
      path: { index: number; cycle: number }[] = [],
      recent = [...history];
    let best: { index: number; cycle: number }[] = [],
      visits = 0;
    const search = (used: ReadonlySet<number>, cycle: number): boolean => {
      if (++visits > 20000)
        return simpleError(
          "count",
          "Playlist search exceeded 20000 visits.",
          "search_budget_exceeded",
        );
      if (path.length > best.length) best = path.map((entry) => ({ ...entry }));
      if (path.length === input.count) return true;
      const exhausted =
        input.cyclePolicy === "exhaust-bank" &&
        used.size === input.items.length;
      const active = exhausted ? new Set<number>() : used,
        round = exhausted ? cycle + 1 : cycle;
      const recentItems =
          input.itemCooldown === 0 ? [] : recent.slice(-input.itemCooldown),
        recentCategories =
          input.categoryCooldown === 0
            ? []
            : recent.slice(-input.categoryCooldown);
      const eligible = input.items.flatMap((item, i) =>
        counts[i] < input.maxPlaysPerItem &&
        (input.cyclePolicy !== "exhaust-bank" || !active.has(i)) &&
        !recentItems.includes(i) &&
        !recentCategories.some(
          (index) => input.items[index].category === item.category,
        )
          ? [i]
          : [],
      );
      if (!eligible.length) return false;
      // A random cyclic traversal orders viable transitions; this is not uniform over full playlists.
      const offset = random.integer(0, eligible.length - 1);
      for (let k = 0; k < eligible.length; k += 1) {
        const index = eligible[(offset + k) % eligible.length],
          next = new Set(active);
        next.add(index);
        counts[index] += 1;
        recent.push(index);
        path.push({
          index,
          cycle: input.cyclePolicy === "exhaust-bank" ? round : 0,
        });
        if (search(next, round)) return true;
        path.pop();
        recent.pop();
        counts[index] -= 1;
      }
      return false;
    };
    const complete = search(initialUsed, initialCycle);
    if (!complete && input.feasibilityPolicy === "require-full")
      simpleError(
        "count",
        "No playlist satisfies every supplied constraint.",
        "infeasible_playlist",
      );
    const selected = complete ? path : best,
      ids = selected.map((entry) => input.items[entry.index].id),
      allCounts = snFrequencies([...input.history, ...ids]),
      newCounts = snFrequencies(ids);
    return toolSuccess(
      snBoundOutput({
        playlist: selected.map((entry) => ({
          item: { ...input.items[entry.index] },
          cycle: entry.cycle,
        })),
        complete,
        frequencies: input.items.map((item) => ({
          itemId: item.id,
          newPlays: newCounts.get(item.id) ?? 0,
          totalPlays: allCounts.get(item.id) ?? 0,
        })),
        finalHistory: [...input.history, ...ids],
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const noRepeatPlaylistCycleExample = {
  input: {
    items: [
      { id: "a", category: "strings", content: "Dawn" },
      { id: "b", category: "keys", content: "Rain" },
      { id: "c", category: "strings", content: "Dusk" },
    ],
    count: 5,
    history: [],
    itemCooldown: 1,
    categoryCooldown: 0,
    maxPlaysPerItem: 2,
    cyclePolicy: "exhaust-bank",
    feasibilityPolicy: "require-full",
    seed: 42,
  },
  output: {
    playlist: [
      { item: { id: "b", category: "keys", content: "Rain" }, cycle: 1 },
      { item: { id: "a", category: "strings", content: "Dawn" }, cycle: 1 },
      { item: { id: "c", category: "strings", content: "Dusk" }, cycle: 1 },
      { item: { id: "b", category: "keys", content: "Rain" }, cycle: 2 },
      { item: { id: "a", category: "strings", content: "Dawn" }, cycle: 2 },
    ],
    complete: true,
    frequencies: [
      { itemId: "a", newPlays: 2, totalPlays: 2 },
      { itemId: "b", newPlays: 2, totalPlays: 2 },
      { itemId: "c", newPlays: 1, totalPlays: 1 },
    ],
    finalHistory: ["b", "a", "c", "b", "a"],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  NoRepeatPlaylistCycleInput,
  NoRepeatPlaylistCycleOutput
>;
export const noRepeatPlaylistCycleTool = createModelDefinition<
  NoRepeatPlaylistCycleInput,
  NoRepeatPlaylistCycleOutput
>({
  id: "random/no-repeat-playlist-cycle",
  title: "Random No-Repeat Playlist Cycle Generator",
  description:
    "Construct supplied-content playlists with exact cooldowns, optional bank-exhaustion cycles, total-play caps, and bounded randomized feasibility search.",
  inputSchema,
  outputSchema,
  execute: calculateNoRepeatPlaylistCycle,
});
export const runNoRepeatPlaylistCycle = noRepeatPlaylistCycleTool.execute;
export default noRepeatPlaylistCycleTool;
