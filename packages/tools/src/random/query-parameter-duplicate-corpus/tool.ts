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
  label,
  bounded,
  choice,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { encode, coreOutput } from "../m500b-web-json-protocol.js";
import { calculateQueryString } from "../../parse/query-string/tool.js";
import { calculateUrlQueryCount } from "../../web/url-query-count/tool.js";
export type QueryParameterDuplicateCorpusInput = {
  readonly keys: readonly string[];
  readonly values: readonly string[];
  readonly pairCount: number;
  readonly policy: "first" | "last" | "all";
  readonly seed?: number;
};
export type QueryParameterDuplicateCorpusOutput = {
  readonly pairs: readonly { readonly key: string; readonly value: string }[];
  readonly query: string;
  readonly parameterCount: number;
  readonly resolved: readonly {
    readonly key: string;
    readonly values: readonly string[];
    readonly legacyLast: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    keys: array(label, 16, 1),
    values: array(text, 16, 1),
    pairCount: bounded(2, 16),
    policy: choice(["first", "last", "all"]),
    seed: generatorSeedSchema,
  },
  ["keys", "values", "pairCount", "policy"],
);
export const outputSchema = object({
  pairs: array(object({ key: text, value: text }), 16, 2),
  query: text,
  parameterCount: bounded(2, 16),
  resolved: array(
    object({ key: text, values: array(text, 16), legacyLast: text }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is QueryParameterDuplicateCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateQueryParameterDuplicateCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<QueryParameterDuplicateCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (
      input.keys.some((k) =>
        ["__proto__", "constructor", "prototype"].includes(k),
      )
    )
      simpleError(
        "keys",
        "Prototype-related keys are unsupported by the reused legacy parser.",
        "unsupported_key",
      );
    if (
      input.pairCount *
        (Math.max(...input.keys.map((k) => encode(k, "keys").length)) +
          Math.max(...input.values.map((v) => encode(v).length)) +
          2) >
      2048
    )
      simpleError(
        "pairCount",
        "Encoded query expansion exceeds 2048 characters.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      key = pick(input.keys, random);
    const pairs = Array.from({ length: input.pairCount }, (_, i) => ({
      key: i < 2 ? key : pick(input.keys, random),
      value: pick(input.values, random),
    }));
    const query = pairs
      .map((p) => encode(p.key, "keys") + "=" + encode(p.value))
      .join("&");
    if (query.length > 2048)
      simpleError(
        "pairCount",
        "Query exceeds 2048 characters.",
        "resource_limit",
      );
    const parsed = calculateQueryString({ queryString: query }).params;
    const resolved = [...new Set(pairs.map((p) => p.key))].map((key) => {
      const values = pairs.filter((p) => p.key === key).map((p) => p.value),
        legacyLast = parsed[key];
      if (typeof legacyLast !== "string")
        throw new Error("Expected last-wins string");
      return {
        key,
        values:
          input.policy === "all"
            ? values
            : input.policy === "first"
              ? values.slice(0, 1)
              : values.slice(-1),
        legacyLast,
      };
    });
    return toolSuccess({
      pairs,
      query,
      parameterCount: coreOutput(
        calculateUrlQueryCount({ url: "https://example.invalid/?" + query }),
      ).count,
      resolved,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const queryParameterDuplicateCorpusExample = {
  input: {
    keys: ["q"],
    values: ["red", "blue"],
    pairCount: 2,
    policy: "all",
    seed: 42,
  },
  output: {
    pairs: [
      { key: "q", value: "red" },
      { key: "q", value: "blue" },
    ],
    query: "q=red&q=blue",
    parameterCount: 2,
    resolved: [{ key: "q", values: ["red", "blue"], legacyLast: "blue" }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  QueryParameterDuplicateCorpusInput,
  QueryParameterDuplicateCorpusOutput
>;
export const queryParameterDuplicateCorpusTool = createModelDefinition<
  QueryParameterDuplicateCorpusInput,
  QueryParameterDuplicateCorpusOutput
>({
  id: "random/query-parameter-duplicate-corpus",
  title: "Random Query Parameter Duplicate Corpus Generator",
  description:
    "Construct ordered repeated query keys and compare explicit first, last or all duplicate policies with legacy last-wins parsing.",
  inputSchema,
  outputSchema,
  execute: calculateQueryParameterDuplicateCorpus,
});
export const runQueryParameterDuplicateCorpus =
  queryParameterDuplicateCorpusTool.execute;
export default queryParameterDuplicateCorpusTool;
