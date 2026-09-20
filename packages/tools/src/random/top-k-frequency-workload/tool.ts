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
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  enumSchema,
  distinct,
} from "../m500b-csv-algorithms-schemas.js";
import { sequenceCounts } from "../m500b-csv-algorithms-sequence.js";

export type TopKFrequencyWorkloadInput = {
  readonly tokens: readonly string[];
  readonly repetitionsPerToken: number;
  readonly extraCount: number;
  readonly k: number;
  readonly tiePolicy: "bank" | "lexicographic" | "first";
  readonly seed?: number;
};
export type TopKFrequencyWorkloadOutput = {
  readonly stream: readonly string[];
  readonly ranking: readonly { readonly key: string; readonly count: number }[];
  readonly topKeys: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    tokens: arraySchema(textSchema, 16, 2),
    repetitionsPerToken: countSchema(4, 1),
    extraCount: countSchema(16),
    k: countSchema(16, 1),
    tiePolicy: enumSchema(["bank", "lexicographic", "first"]),
    seed: generatorSeedSchema,
  },
  ["tokens", "repetitionsPerToken", "extraCount", "k", "tiePolicy"],
);
export const outputSchema = objectSchema({
  stream: arraySchema(textSchema, 64),
  ranking: arraySchema(
    objectSchema({ key: textSchema, count: countSchema(64, 1) }),
    16,
  ),
  topKeys: arraySchema(textSchema, 16),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is TopKFrequencyWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateTopKFrequencyWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TopKFrequencyWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.tokens, "tokens");
    if (input.k > input.tokens.length)
      return simpleError("k", "Top k must fit the token bank.", "invalid_k");
    if (input.tokens.length * input.repetitionsPerToken + input.extraCount > 64)
      return simpleError(
        "extraCount",
        "The workload is limited to 64 tokens.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      planted = input.tokens.flatMap((token) =>
        Array<string>(input.repetitionsPerToken).fill(token),
      );
    for (let index = 0; index < input.extraCount; index += 1)
      planted.push(random.pick(input.tokens));
    const stream = random.shuffle(planted),
      ranking = sequenceCounts(stream);
    ranking.sort(
      (a, b) =>
        b.count - a.count ||
        (input.tiePolicy === "lexicographic"
          ? a.key < b.key
            ? -1
            : a.key > b.key
              ? 1
              : 0
          : input.tiePolicy === "bank"
            ? input.tokens.indexOf(a.key) - input.tokens.indexOf(b.key)
            : stream.indexOf(a.key) - stream.indexOf(b.key)),
    );
    return toolSuccess({
      stream,
      ranking,
      topKeys: ranking.slice(0, input.k).map((entry) => entry.key),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const topKFrequencyWorkloadExample = {
  input: {
    tokens: ["b", "a"],
    repetitionsPerToken: 2,
    extraCount: 0,
    k: 1,
    tiePolicy: "lexicographic",
    seed: 42,
  },
  output: {
    stream: ["b", "a", "b", "a"],
    ranking: [
      { key: "a", count: 2 },
      { key: "b", count: 2 },
    ],
    topKeys: ["a"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  TopKFrequencyWorkloadInput,
  TopKFrequencyWorkloadOutput
>;
export const topKFrequencyWorkloadTool = createModelDefinition<
  TopKFrequencyWorkloadInput,
  TopKFrequencyWorkloadOutput
>({
  id: "random/top-k-frequency-workload",
  title: "Random Top K Frequency Workload Generator",
  description:
    "Construct repeated token counts with optional sampled extras, shuffle the stream and retain exact top-k answers under explicit bank, UTF-16 lexical or first-occurrence tie ordering.",
  inputSchema,
  outputSchema,
  execute: calculateTopKFrequencyWorkload,
});
export const runTopKFrequencyWorkload = topKFrequencyWorkloadTool.execute;
export default topKFrequencyWorkloadTool;
