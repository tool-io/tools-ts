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
import { runSubtractTwoNumbers } from "../../arithmetic/subtract-two-numbers/tool.js";

export type DumbbellGapComparisonDatasetInput = {
  readonly labels: readonly string[];
  readonly minimumStart: number;
  readonly maximumStart: number;
  readonly minimumGap: number;
  readonly maximumGap: number;
  readonly overlap: "allowed" | "force-one";
  readonly seed?: number;
};
export type DumbbellGapComparisonDatasetOutput = {
  readonly rows: readonly {
    readonly label: string;
    readonly start: number;
    readonly end: number;
    readonly gap: number;
    readonly overlaps: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    labels: array(label, 32, 1),
    minimumStart: integer,
    maximumStart: integer,
    minimumGap: integer,
    maximumGap: integer,
    overlap: { type: "string", enum: ["allowed", "force-one"] },
    seed: generatorSeedSchema,
  },
  [
    "labels",
    "minimumStart",
    "maximumStart",
    "minimumGap",
    "maximumGap",
    "overlap",
  ],
);
export const outputSchema = object({
  rows: array(
    object({
      label: label,
      start: integer,
      end: integer,
      gap: integer,
      overlaps: bool,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is DumbbellGapComparisonDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateDumbbellGapComparisonDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DumbbellGapComparisonDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.labels, "labels");
    if (
      input.minimumStart > input.maximumStart ||
      input.minimumGap > input.maximumGap
    )
      simpleError(
        "maximumGap",
        "Start and gap ranges must be ordered.",
        "invalid_range",
      );
    if (
      input.overlap === "force-one" &&
      (input.minimumGap > 0 || input.maximumGap < 0)
    )
      simpleError(
        "overlap",
        "Forcing overlap requires zero inside the gap range.",
        "infeasible_overlap",
      );
    for (const a of [input.minimumStart, input.maximumStart])
      for (const b of [input.minimumGap, input.maximumGap])
        safe(a + b, "maximumGap");
    const rows = input.labels.map((label, i) => {
      const start = random.integer(input.minimumStart, input.maximumStart),
        sampled = random.integer(input.minimumGap, input.maximumGap),
        end = safe(
          start + (input.overlap === "force-one" && i === 0 ? 0 : sampled),
        ),
        gap = finite(
          core(runSubtractTwoNumbers({ minuend: end, subtrahend: start }))
            .difference,
        );
      return { label, start, end, gap, overlaps: gap === 0 };
    });
    const result = { rows };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const dumbbellGapComparisonDatasetExample = {
  input: {
    labels: ["a", "b"],
    minimumStart: 0,
    maximumStart: 9,
    minimumGap: -2,
    maximumGap: 2,
    overlap: "allowed",
    seed: 42,
  },
  output: {
    rows: [
      { label: "a", start: 6, end: 6, gap: 0, overlaps: true },
      { label: "b", start: 8, end: 9, gap: 1, overlaps: false },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DumbbellGapComparisonDatasetInput,
  DumbbellGapComparisonDatasetOutput
>;
export const dumbbellGapComparisonDatasetTool = createModelDefinition<
  DumbbellGapComparisonDatasetInput,
  DumbbellGapComparisonDatasetOutput
>({
  id: "random/dumbbell-gap-comparison-dataset",
  title: "Random Dumbbell Gap Comparison Dataset Generator",
  description:
    "Generate paired category endpoints with exact signed gaps and an optional forced overlapping pair.",
  inputSchema,
  outputSchema,
  execute: calculateDumbbellGapComparisonDataset,
});
export const runDumbbellGapComparisonDataset =
  dumbbellGapComparisonDatasetTool.execute;
export default dumbbellGapComparisonDatasetTool;
