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
  label,
  bounded,
  choice,
} from "../m500b-web-json-schema.js";
import { pick, distinct } from "../m500b-web-json-json.js";
import { token } from "../m500b-web-json-protocol.js";
import { calculateVaryParser } from "../../web/vary-parser/tool.js";
export type HttpVaryCacheKeyFixtureInput = {
  readonly dimensions: readonly {
    readonly name: string;
    readonly values: readonly string[];
  }[];
  readonly wildcard: boolean;
  readonly policy: "exact" | "trim";
  readonly count: number;
  readonly seed?: number;
};
export type HttpVaryCacheKeyFixtureOutput = {
  readonly vary: string;
  readonly requests: readonly {
    readonly headers: readonly {
      readonly name: string;
      readonly value: string;
    }[];
    readonly key: string;
  }[];
  readonly partitions: readonly (readonly number[])[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    dimensions: array(
      object({ name: label, values: array(text, 16, 1) }),
      8,
      1,
    ),
    wildcard: { type: "boolean" },
    policy: choice(["exact", "trim"]),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["dimensions", "wildcard", "policy", "count"],
);
export const outputSchema = object({
  vary: text,
  requests: array(
    object({
      headers: array(object({ name: text, value: text }), 8),
      key: text,
    }),
    32,
    1,
  ),
  partitions: array(array(bounded(0, 31), 32, 1), 32),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HttpVaryCacheKeyFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpVaryCacheKeyFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpVaryCacheKeyFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.dimensions.map((d) => d.name.toLowerCase()),
      "dimensions",
    );
    if (
      input.dimensions.some(
        (d) => !token.test(d.name) || d.values.some((v) => /[\r\n]/u.test(v)),
      )
    )
      simpleError(
        "dimensions",
        "Use line-free HTTP field dimensions.",
        "invalid_header",
      );
    const vary = input.wildcard
        ? "*"
        : input.dimensions.map((d) => d.name).join(", "),
      parsed = calculateVaryParser({ header: vary }),
      random = createGeneratorRandom(input.seed, context);
    const requests = Array.from({ length: input.count }, (_, i) => {
      const headers = input.dimensions.map((d) => ({
        name: d.name.toLowerCase(),
        value: pick(d.values, random),
      }));
      const key = parsed.wildcard
        ? "wildcard:" + i
        : JSON.stringify(
            parsed.fieldNames.map((name) => {
              const value = headers.find((h) => h.name === name)?.value ?? "";
              return [name, input.policy === "trim" ? value.trim() : value];
            }),
          );
      return { headers, key };
    });
    const groups = new Map<string, number[]>();
    requests.forEach((r, i) => {
      const group = groups.get(r.key) ?? [];
      group.push(i);
      groups.set(r.key, group);
    });
    return toolSuccess({
      vary,
      requests,
      partitions: [...groups.values()],
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpVaryCacheKeyFixtureExample = {
  input: {
    dimensions: [{ name: "Accept-Language", values: ["en", "fr"] }],
    wildcard: false,
    policy: "exact",
    count: 2,
    seed: 42,
  },
  output: {
    vary: "Accept-Language",
    requests: [
      {
        headers: [{ name: "accept-language", value: "fr" }],
        key: '[["accept-language","fr"]]',
      },
      {
        headers: [{ name: "accept-language", value: "en" }],
        key: '[["accept-language","en"]]',
      },
    ],
    partitions: [[0], [1]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpVaryCacheKeyFixtureInput,
  HttpVaryCacheKeyFixtureOutput
>;
export const httpVaryCacheKeyFixtureTool = createModelDefinition<
  HttpVaryCacheKeyFixtureInput,
  HttpVaryCacheKeyFixtureOutput
>({
  id: "random/http-vary-cache-key-fixture",
  title: "Random HTTP Vary Cache Key Fixture Generator",
  description:
    "Construct synthetic request-header dimensions and exact tuple-key partitions under an explicit trim or exact policy, with wildcard requests isolated.",
  inputSchema,
  outputSchema,
  execute: calculateHttpVaryCacheKeyFixture,
});
export const runHttpVaryCacheKeyFixture = httpVaryCacheKeyFixtureTool.execute;
export default httpVaryCacheKeyFixtureTool;
