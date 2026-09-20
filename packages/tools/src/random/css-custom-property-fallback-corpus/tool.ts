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
import { calculateVariableParser } from "../../css/variable-parser/tool.js";
import { calculate as resolveFallback } from "../../css/variable-fallback-chain-resolution/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  coreOutput,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type CssCustomPropertyFallbackCorpusInput = {
  readonly count: number;
  readonly depth: NumericRange;
  readonly literalTokens: readonly string[];
  readonly bindingProbability: number;
  readonly seed?: number;
};
export type CssFallbackCase = {
  readonly expression: string;
  readonly declarations: string;
  readonly parsedBindings: readonly {
    readonly name: string;
    readonly value: string;
  }[];
  readonly normalizedGraph: {
    readonly variableNames: readonly string[];
    readonly literalTokens: readonly string[];
    readonly referencedVariables: readonly string[];
    readonly fallbackTokens: readonly string[];
    readonly queryVariable: string;
  };
  readonly resolvedToken: string;
  readonly visitedVariables: readonly string[];
};
export type CssCustomPropertyFallbackCorpusOutput = {
  readonly cases: readonly CssFallbackCase[];
  readonly randomness: GeneratorReplay;
};
const strings = arraySchema({ type: "string", maxLength: 128 }, 8);
const graph = objectSchema({
  variableNames: strings,
  literalTokens: strings,
  referencedVariables: strings,
  fallbackTokens: strings,
  queryVariable: { type: "string" },
});
export const inputSchema = objectSchema(
  {
    count: countSchema(32),
    depth: rangeSchema(countSchema(8)),
    literalTokens: arraySchema(
      {
        type: "string",
        minLength: 1,
        maxLength: 128,
        pattern: "^[-#A-Za-z0-9 .%]+(?![\\s\\S])",
      },
      32,
      1,
    ),
    bindingProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  ["count", "depth", "literalTokens", "bindingProbability"],
);
export const outputSchema = objectSchema({
  cases: arraySchema(
    objectSchema({
      expression: { type: "string", maxLength: 2048 },
      declarations: { type: "string", maxLength: 2048 },
      parsedBindings: arraySchema(
        objectSchema({ name: { type: "string" }, value: { type: "string" } }),
        8,
      ),
      normalizedGraph: graph,
      resolvedToken: { type: "string", maxLength: 128 },
      visitedVariables: strings,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is CssCustomPropertyFallbackCorpusInput =>
  matchesModelInput(value, inputSchema);
export const calculateCssCustomPropertyFallbackCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CssCustomPropertyFallbackCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.depth, "depth");
    if (input.literalTokens.some((x) => !x.trim()))
      simpleError(
        "literalTokens",
        "Literal tokens must contain non-whitespace text.",
        "empty_literal",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const depth = drawInteger(input.depth, random, "depth"),
        variableNames = Array.from({ length: depth }, (_, i) => "--v" + i);
      const bindings = variableNames.flatMap((name) =>
        random.unit() < input.bindingProbability
          ? [{ name, value: random.pick(input.literalTokens).trim() }]
          : [],
      );
      const terminal = random.pick(input.literalTokens).trim();
      let expression = terminal;
      for (let i = depth - 1; i >= 0; i--)
        expression = "var(" + variableNames[i] + ", " + expression + ")";
      const declarations = bindings
        .map((b) => b.name + ": " + b.value + ";")
        .join(" ");
      const parsedBindings = coreOutput(
        calculateVariableParser({ declarations }),
      ).variables;
      const literalTokens = variableNames.map(
        (name, i) =>
          bindings.find((b) => b.name === name)?.value ??
          (i === depth - 1 ? terminal : ""),
      );
      const referencedVariables = variableNames.map((name, i) =>
        bindings.some((b) => b.name === name) || i === depth - 1
          ? ""
          : variableNames[i + 1],
      );
      const normalizedGraph = {
        variableNames,
        literalTokens,
        referencedVariables,
        fallbackTokens: variableNames.map(() => ""),
        queryVariable: variableNames[0],
      };
      const resolved = resolveFallback(normalizedGraph);
      return {
        expression,
        declarations,
        parsedBindings,
        normalizedGraph,
        ...resolved,
      };
    });
    return toolSuccess(
      ensureOutput(
        { cases, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cssCustomPropertyFallbackCorpusExample = {
  input: {
    count: 2,
    depth: {
      minimum: 3,
      maximum: 3,
    },
    literalTokens: ["red", "blue", "green"],
    bindingProbability: 0.5,
    seed: 42,
  },
  output: {
    cases: [
      {
        expression: "var(--v0, var(--v1, var(--v2, red)))",
        declarations: "--v0: green; --v2: blue;",
        parsedBindings: [
          {
            name: "--v0",
            value: "green",
          },
          {
            name: "--v2",
            value: "blue",
          },
        ],
        normalizedGraph: {
          variableNames: ["--v0", "--v1", "--v2"],
          literalTokens: ["green", "", "blue"],
          referencedVariables: ["", "--v2", ""],
          fallbackTokens: ["", "", ""],
          queryVariable: "--v0",
        },
        resolvedToken: "green",
        visitedVariables: ["--v0"],
      },
      {
        expression: "var(--v0, var(--v1, var(--v2, green)))",
        declarations: "--v1: red;",
        parsedBindings: [
          {
            name: "--v1",
            value: "red",
          },
        ],
        normalizedGraph: {
          variableNames: ["--v0", "--v1", "--v2"],
          literalTokens: ["", "red", "green"],
          referencedVariables: ["--v1", "", ""],
          fallbackTokens: ["", "", ""],
          queryVariable: "--v0",
        },
        resolvedToken: "red",
        visitedVariables: ["--v0", "--v1"],
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  CssCustomPropertyFallbackCorpusInput,
  CssCustomPropertyFallbackCorpusOutput
>;
export const cssCustomPropertyFallbackCorpusTool = createModelDefinition<
  CssCustomPropertyFallbackCorpusInput,
  CssCustomPropertyFallbackCorpusOutput
>({
  id: "random/css-custom-property-fallback-corpus",
  title: "Random CSS Custom Property Fallback Corpus Generator",
  description:
    "Compose nested var fallback expressions and literal bindings, then lower their acyclic fallback paths to the supported core resolver.",
  inputSchema,
  outputSchema,
  execute: calculateCssCustomPropertyFallbackCorpus,
});
export const runCssCustomPropertyFallbackCorpus =
  cssCustomPropertyFallbackCorpusTool.execute;
export default cssCustomPropertyFallbackCorpusTool;
