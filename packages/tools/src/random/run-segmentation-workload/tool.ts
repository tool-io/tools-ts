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
  distinct,
} from "../m500b-csv-algorithms-schemas.js";
import { sequenceCounts } from "../m500b-csv-algorithms-sequence.js";

export type RunSegmentationWorkloadInput = {
  readonly tokens: readonly string[];
  readonly runCount: number;
  readonly minimumRunLength: number;
  readonly maximumRunLength: number;
  readonly seed?: number;
};
type RunSegment = {
  readonly token: string;
  readonly start: number;
  readonly endExclusive: number;
  readonly length: number;
};
export type RunSegmentationWorkloadOutput = {
  readonly stream: readonly string[];
  readonly segments: readonly RunSegment[];
  readonly boundaries: readonly number[];
  readonly counts: readonly { readonly key: string; readonly count: number }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    tokens: arraySchema(textSchema, 8, 2),
    runCount: countSchema(16, 1),
    minimumRunLength: countSchema(8, 1),
    maximumRunLength: countSchema(8, 1),
    seed: generatorSeedSchema,
  },
  ["tokens", "runCount", "minimumRunLength", "maximumRunLength"],
);
export const outputSchema = objectSchema({
  stream: arraySchema(textSchema, 128),
  segments: arraySchema(
    objectSchema({
      token: textSchema,
      start: countSchema(127),
      endExclusive: countSchema(128, 1),
      length: countSchema(8, 1),
    }),
    16,
  ),
  boundaries: arraySchema(countSchema(128), 17, 2),
  counts: arraySchema(
    objectSchema({ key: textSchema, count: countSchema(128, 1) }),
    8,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is RunSegmentationWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateRunSegmentationWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RunSegmentationWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.tokens, "tokens");
    if (input.minimumRunLength > input.maximumRunLength)
      return simpleError(
        "maximumRunLength",
        "Run-length bounds must be ordered.",
        "invalid_run_range",
      );
    if (input.runCount * input.maximumRunLength > 128)
      return simpleError(
        "runCount",
        "The largest possible stream must fit 128 tokens.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      stream: string[] = [],
      boundaries = [0],
      segments: RunSegment[] = [];
    let previous: string | null = null;
    for (let run = 0; run < input.runCount; run += 1) {
      const token = random.pick(
          input.tokens.filter((candidate) => candidate !== previous),
        ),
        length = random.integer(input.minimumRunLength, input.maximumRunLength),
        start = stream.length;
      for (let index = 0; index < length; index += 1) stream.push(token);
      segments.push({ token, start, endExclusive: stream.length, length });
      boundaries.push(stream.length);
      previous = token;
    }
    return toolSuccess({
      stream,
      segments,
      boundaries,
      counts: sequenceCounts(stream),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const runSegmentationWorkloadExample = {
  input: {
    tokens: ["A", "B"],
    runCount: 3,
    minimumRunLength: 1,
    maximumRunLength: 3,
    seed: 42,
  },
  output: {
    stream: ["B", "B", "A", "A", "A", "B", "B"],
    segments: [
      { token: "B", start: 0, endExclusive: 2, length: 2 },
      { token: "A", start: 2, endExclusive: 5, length: 3 },
      { token: "B", start: 5, endExclusive: 7, length: 2 },
    ],
    boundaries: [0, 2, 5, 7],
    counts: [
      { key: "B", count: 4 },
      { key: "A", count: 3 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RunSegmentationWorkloadInput,
  RunSegmentationWorkloadOutput
>;
export const runSegmentationWorkloadTool = createModelDefinition<
  RunSegmentationWorkloadInput,
  RunSegmentationWorkloadOutput
>({
  id: "random/run-segmentation-workload",
  title: "Random Run Segmentation Workload Generator",
  description:
    "Construct token runs with bounded sampled lengths and guaranteed adjacent token changes, retaining exclusive segment boundaries and exact global frequencies independently of text encoding.",
  inputSchema,
  outputSchema,
  execute: calculateRunSegmentationWorkload,
});
export const runRunSegmentationWorkload = runSegmentationWorkloadTool.execute;
export default runSegmentationWorkloadTool;
