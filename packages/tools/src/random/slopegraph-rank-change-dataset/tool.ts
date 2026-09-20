import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";

export type SlopegraphRankChangeDatasetInput = {
  readonly labels: readonly string[];
  readonly spacing: number;
  readonly mode: "reverse" | "retain";
  readonly seed?: number;
};
export type SlopegraphRankChangeDatasetOutput = {
  readonly rows: readonly {
    readonly label: string;
    readonly before: number;
    readonly after: number;
    readonly beforeRank: number;
    readonly afterRank: number;
    readonly rankChange: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    labels: array(label, 16, 2),
    spacing: { type: "integer", minimum: 0, maximum: 1000000 },
    mode: { type: "string", enum: ["reverse", "retain"] },
    seed: generatorSeedSchema,
  },
  ["labels", "spacing", "mode"],
);
export const outputSchema = object({
  rows: array(
    object({
      label: label,
      before: integer,
      after: integer,
      beforeRank: integer,
      afterRank: integer,
      rankChange: integer,
    }),
    16,
    2,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SlopegraphRankChangeDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateSlopegraphRankChangeDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SlopegraphRankChangeDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.labels, "labels");
    const order = random.shuffle(input.labels),
      before = input.labels.map(
        (id) => (order.indexOf(id) + 1) * input.spacing,
      ),
      after = input.labels.map(
        (id) =>
          (input.mode === "reverse"
            ? order.length - order.indexOf(id)
            : order.indexOf(id) + 1) * input.spacing,
      );
    const rank = (values: readonly number[], v: number) =>
      1 + values.filter((x) => x > v).length;
    const result = {
      rows: input.labels.map((label, i) => {
        const beforeRank = rank(before, before[i]),
          afterRank = rank(after, after[i]);
        return {
          label,
          before: before[i],
          after: after[i],
          beforeRank,
          afterRank,
          rankChange: afterRank - beforeRank,
        };
      }),
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const slopegraphRankChangeDatasetExample = {
  input: { labels: ["a", "b", "c"], spacing: 2, mode: "reverse", seed: 42 },
  output: {
    rows: [
      {
        label: "a",
        before: 4,
        after: 4,
        beforeRank: 2,
        afterRank: 2,
        rankChange: 0,
      },
      {
        label: "b",
        before: 6,
        after: 2,
        beforeRank: 1,
        afterRank: 3,
        rankChange: 2,
      },
      {
        label: "c",
        before: 2,
        after: 6,
        beforeRank: 3,
        afterRank: 1,
        rankChange: -2,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SlopegraphRankChangeDatasetInput,
  SlopegraphRankChangeDatasetOutput
>;
export const slopegraphRankChangeDatasetTool = createModelDefinition<
  SlopegraphRankChangeDatasetInput,
  SlopegraphRankChangeDatasetOutput
>({
  id: "random/slopegraph-rank-change-dataset",
  title: "Random Slopegraph Rank Change Dataset Generator",
  description:
    "Construct synthetic two-state category values with controlled reversal or retention and explicit ties and competition-rank changes.",
  inputSchema,
  outputSchema,
  execute: calculateSlopegraphRankChangeDataset,
});
export const runSlopegraphRankChangeDataset =
  slopegraphRankChangeDatasetTool.execute;
export default slopegraphRankChangeDatasetTool;
