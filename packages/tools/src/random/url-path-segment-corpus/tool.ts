import { budget as fixtureBudget } from "../m500b-web-json-json.js";
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
import { object, array, text, bounded } from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { httpUrl, coreOutput, encode } from "../m500b-web-json-protocol.js";
import { calculateUrlPathSegments } from "../../web/url-path-segments/tool.js";
export type UrlPathSegmentCorpusInput = {
  readonly baseUrl: string;
  readonly segments: readonly string[];
  readonly segmentCount: number;
  readonly count: number;
  readonly seed?: number;
};
export type UrlPathSegmentCorpusOutput = {
  readonly cases: readonly {
    readonly sourceSegments: readonly string[];
    readonly rawPath: string;
    readonly url: string;
    readonly normalizedSegments: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    baseUrl: text,
    segments: array(text, 16, 1),
    segmentCount: bounded(1, 16),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["baseUrl", "segments", "segmentCount", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      sourceSegments: array(text, 16),
      rawPath: text,
      url: text,
      normalizedSegments: array(text, 17),
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is UrlPathSegmentCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateUrlPathSegmentCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UrlPathSegmentCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const base = httpUrl(input.baseUrl, "baseUrl");
    if (
      input.segmentCount *
        (Math.max(...input.segments.map((s) => encode(s, "segments").length)) +
          1) >
      1800
    )
      simpleError(
        "segmentCount",
        "Encoded path expansion exceeds 1800 characters.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const sourceSegments = Array.from({ length: input.segmentCount }, () =>
        pick(input.segments, random),
      );
      const rawPath =
        "/" + sourceSegments.map((s) => encode(s, "segments")).join("/");
      if (rawPath.length > 1800)
        simpleError(
          "segmentCount",
          "Serialized path exceeds 1800 characters.",
          "resource_limit",
        );
      const url = httpUrl(base.origin + rawPath, "segments").href;
      return {
        sourceSegments,
        rawPath,
        url,
        normalizedSegments: coreOutput(calculateUrlPathSegments({ url }))
          .segments,
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const urlPathSegmentCorpusExample = {
  input: {
    baseUrl: "https://example.com/",
    segments: ["a b", ""],
    segmentCount: 2,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        sourceSegments: ["", "a b"],
        rawPath: "//a%20b",
        url: "https://example.com//a%20b",
        normalizedSegments: ["", "a%20b"],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<UrlPathSegmentCorpusInput, UrlPathSegmentCorpusOutput>;
export const urlPathSegmentCorpusTool = createModelDefinition<
  UrlPathSegmentCorpusInput,
  UrlPathSegmentCorpusOutput
>({
  id: "random/url-path-segment-corpus",
  title: "Random URL Path Segment Corpus Generator",
  description:
    "Construct encoded synthetic path segments and retain WHATWG dot normalization and empty-segment parser expectations.",
  inputSchema,
  outputSchema,
  execute: calculateUrlPathSegmentCorpus,
});
export const runUrlPathSegmentCorpus = urlPathSegmentCorpusTool.execute;
export default urlPathSegmentCorpusTool;
