import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  bounded,
  aligned,
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly topicIds: readonly string[];
  readonly practiceItemIds: readonly string[];
  readonly itemTopicIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "topicIds", label: "Topic ids", kind: "stringList" },
  { id: "practiceItemIds", label: "Practice item ids", kind: "stringList" },
  { id: "itemTopicIds", label: "Item topic ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.topicIds, "topics");
  unique(input.practiceItemIds, "items");
  aligned(input.practiceItemIds, input.itemTopicIds, "topic annotations");
  if (input.itemTopicIds.some((v) => !input.topicIds.includes(v)))
    simpleError("topics", "Every item uses an explicit topic ID.");
  bounded(
    input.count,
    "playlist",
    1,
    Math.min(64, input.practiceItemIds.length),
  );
  const used = new Set<number>(),
    chosen: number[] = [];
  let previous = "";
  for (let n = 0; n < input.count; n++) {
    const eligible = input.topicIds.filter(
      (t) =>
        t !== previous &&
        input.itemTopicIds.some((v, i) => v === t && !used.has(i)),
    );
    if (!eligible.length)
      simpleError(
        "interleave",
        "Requested no-adjacent-topic playlist infeasible under sampled prefix; no silent repeats, biased backtracking or global feasibility guarantee.",
      );
    const tj = indices(
        eligible.length,
        { seed: input.seed, count: 1, withoutReplacement: false },
        random,
      )[0],
      topic = eligible[tj],
      pool = input.itemTopicIds.flatMap((v, i) =>
        v === topic && !used.has(i) ? [i] : [],
      ),
      ij = indices(
        pool.length,
        { seed: input.seed, count: 1, withoutReplacement: false },
        random,
      )[0],
      k = pool[ij];
    used.add(k);
    chosen.push(k);
    previous = topic;
  }
  return {
    result: {
      playlist: chosen.map((i) => ({
        itemId: input.practiceItemIds[i],
        topicId: input.itemTopicIds[i],
      })),
      unusedItemIds: input.practiceItemIds.filter((_, i) => !used.has(i)),
      samplingConvention: "uniform-eligible-topic-then-uniform-remaining-item",
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 2,
    topicIds: ["a", "b"],
    practiceItemIds: ["a-1", "a-2", "b-1"],
    itemTopicIds: ["a", "a", "b"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/interleaved-topic-practice-playlist",
  title: "Random Interleaved Topic Practice Playlist Generator",
  description:
    "Build bounded distinct-item practice playlists with no adjacent equal topic. Uniform eligible topics, not globally uniform feasible playlists; explicit failure if sampled prefix exhausts another topic. No learning-efficacy claim.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
