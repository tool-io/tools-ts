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
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  bounded,
  choice,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { calculateBearerExtractor } from "../../http/bearer-extractor/tool.js";
import { SimpleToolError } from "../../core/simple.js";
export type HttpBearerShapeCorpusInput = {
  readonly tokens: readonly string[];
  readonly styles: readonly ("plain" | "lower" | "padded" | "invalid-space")[];
  readonly count: number;
  readonly seed?: number;
};
export type HttpBearerShapeCorpusOutput = {
  readonly cases: readonly {
    readonly authorization: string;
    readonly style: string;
    readonly accepted: boolean;
    readonly token: string;
    readonly errorCode: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    tokens: array(text, 16, 1),
    styles: array(choice(["plain", "lower", "padded", "invalid-space"]), 4, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["tokens", "styles", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      authorization: text,
      style: text,
      accepted: boolean,
      token: text,
      errorCode: text,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HttpBearerShapeCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpBearerShapeCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpBearerShapeCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (
      input.tokens.some((t) => !/^[A-Za-z0-9._~+/-]+={0,}(?![\s\S])/u.test(t))
    )
      simpleError(
        "tokens",
        "Supply nonempty fake Bearer-shape strings.",
        "invalid_token",
      );
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const token = pick(input.tokens, random),
          style = pick(input.styles, random);
        const authorization =
          style === "lower"
            ? "bearer " + token
            : style === "padded"
              ? " \tBearer\t" + token + "\t "
              : style === "invalid-space"
                ? "Bearer " + token + " illegal"
                : "Bearer " + token;
        try {
          return {
            authorization,
            style,
            accepted: true,
            token: calculateBearerExtractor({ authorization }).token,
            errorCode: "",
          };
        } catch (error) {
          if (!(error instanceof SimpleToolError)) throw error;
          return {
            authorization,
            style,
            accepted: false,
            token: "",
            errorCode: error.code,
          };
        }
      });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpBearerShapeCorpusExample = {
  input: {
    tokens: ["fake-1", "fake-2._~"],
    styles: ["plain"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        authorization: "Bearer fake-2._~",
        style: "plain",
        accepted: true,
        token: "fake-2._~",
        errorCode: "",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpBearerShapeCorpusInput,
  HttpBearerShapeCorpusOutput
>;
export const httpBearerShapeCorpusTool = createModelDefinition<
  HttpBearerShapeCorpusInput,
  HttpBearerShapeCorpusOutput
>({
  id: "random/http-bearer-shape-corpus",
  title: "Random HTTP Bearer Shape Corpus Generator",
  description:
    "Construct fake Bearer header casing and whitespace variants with malformed-token controls and delegated extraction answers.",
  inputSchema,
  outputSchema,
  execute: calculateHttpBearerShapeCorpus,
});
export const runHttpBearerShapeCorpus = httpBearerShapeCorpusTool.execute;
export default httpBearerShapeCorpusTool;
