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
import {
  object,
  array,
  text,
  bounded,
  choice,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { httpUrl, coreOutput } from "../m500b-web-json-protocol.js";
import { calculateUrlOrigin } from "../../web/url-origin/tool.js";
export type UrlOriginComparisonQuizInput = {
  readonly baseUrl: string;
  readonly mutations: readonly ("path" | "scheme" | "host" | "port")[];
  readonly count: number;
  readonly seed?: number;
};
export type UrlOriginComparisonQuizOutput = {
  readonly pairs: readonly {
    readonly left: string;
    readonly right: string;
    readonly mutation: string;
    readonly leftOrigin: string;
    readonly rightOrigin: string;
    readonly sameOrigin: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    baseUrl: text,
    mutations: array(choice(["path", "scheme", "host", "port"]), 4, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["baseUrl", "mutations", "count"],
);
export const outputSchema = object({
  pairs: array(
    object({
      left: text,
      right: text,
      mutation: text,
      leftOrigin: text,
      rightOrigin: text,
      sameOrigin: boolean,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is UrlOriginComparisonQuizInput =>
  matchesModelInput(input, inputSchema);
export const calculateUrlOriginComparisonQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UrlOriginComparisonQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const base = httpUrl(input.baseUrl, "baseUrl"),
      random = createGeneratorRandom(input.seed, context);
    const pairs = Array.from({ length: input.count }, (_, i) => {
      const mutation = pick(input.mutations, random),
        scheme = base.protocol === "https:" ? "http:" : "https:";
      const right =
        mutation === "path"
          ? base.origin + "/changed/" + (i + 1)
          : mutation === "scheme"
            ? scheme + "//" + base.host + base.pathname
            : mutation === "host"
              ? base.protocol +
                "//alternate.invalid" +
                (base.port ? ":" + base.port : "") +
                base.pathname
              : base.protocol +
                "//" +
                base.hostname +
                ":" +
                (base.port === "8443" ? "8444" : "8443") +
                base.pathname;
      const leftOrigin = coreOutput(
          calculateUrlOrigin({ url: base.href }),
        ).origin,
        rightOrigin = coreOutput(calculateUrlOrigin({ url: right })).origin;
      return {
        left: base.href,
        right,
        mutation,
        leftOrigin,
        rightOrigin,
        sameOrigin: leftOrigin === rightOrigin,
      };
    });
    return toolSuccess({
      pairs,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const urlOriginComparisonQuizExample = {
  input: {
    baseUrl: "https://EXAMPLE.com:443/a",
    mutations: ["scheme", "path"],
    count: 2,
    seed: 42,
  },
  output: {
    pairs: [
      {
        left: "https://example.com/a",
        right: "https://example.com/changed/1",
        mutation: "path",
        leftOrigin: "https://example.com",
        rightOrigin: "https://example.com",
        sameOrigin: true,
      },
      {
        left: "https://example.com/a",
        right: "http://example.com/a",
        mutation: "scheme",
        leftOrigin: "https://example.com",
        rightOrigin: "http://example.com",
        sameOrigin: false,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  UrlOriginComparisonQuizInput,
  UrlOriginComparisonQuizOutput
>;
export const urlOriginComparisonQuizTool = createModelDefinition<
  UrlOriginComparisonQuizInput,
  UrlOriginComparisonQuizOutput
>({
  id: "random/url-origin-comparison-quiz",
  title: "Random URL Origin Comparison Quiz Generator",
  description:
    "Construct HTTP(S) URL mutations and compare normalized scheme, host and port origins without live requests.",
  inputSchema,
  outputSchema,
  execute: calculateUrlOriginComparisonQuiz,
});
export const runUrlOriginComparisonQuiz = urlOriginComparisonQuizTool.execute;
export default urlOriginComparisonQuizTool;
