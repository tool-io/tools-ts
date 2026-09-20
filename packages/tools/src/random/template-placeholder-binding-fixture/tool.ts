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
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type TemplatePlaceholderBindingFixtureInput = {
  readonly templates: readonly string[];
  readonly bindings: readonly {
    readonly key: string;
    readonly value: string;
  }[];
  readonly control: "none" | "missing" | "extra" | "both";
  readonly count: number;
  readonly seed?: number;
};
export type TemplatePlaceholderBindingFixtureOutput = {
  readonly cases: readonly {
    readonly template: string;
    readonly bindings: readonly {
      readonly key: string;
      readonly value: string;
    }[];
    readonly rendered: string;
    readonly missing: readonly string[];
    readonly extra: readonly string[];
    readonly repeated: readonly string[];
    readonly prettyBindings: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const binding = object({ key: label, value: text });
export const inputSchema = object(
  {
    templates: array({ type: "string", maxLength: 2048 }, 16, 1),
    bindings: array(binding, 16),
    control: choice(["none", "missing", "extra", "both"]),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["templates", "bindings", "control", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      template: text,
      bindings: array(binding, 17),
      rendered: text,
      missing: array(text, 409),
      extra: array(text, 17),
      repeated: array(text, 256),
      prettyBindings: text,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is TemplatePlaceholderBindingFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateTemplatePlaceholderBindingFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TemplatePlaceholderBindingFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.bindings.map((b) => b.key),
      "bindings",
    );
    if (
      input.bindings.some(
        (b) => !/^[A-Za-z_][A-Za-z0-9_]*(?![\s\S])/u.test(b.key),
      )
    )
      simpleError(
        "bindings",
        "Binding names must be ASCII identifiers.",
        "invalid_binding_name",
      );
    const placeholders = (s: string) =>
      [...s.matchAll(/\{\{([A-Za-z_][A-Za-z0-9_]*)\}\}/gu)].map(
        (m) => m[1] ?? "",
      );
    if (
      (input.control === "missing" || input.control === "both") &&
      input.templates.some((t) => placeholders(t).length === 0)
    )
      simpleError(
        "templates",
        "Missing-binding controls need a placeholder in every template.",
        "no_placeholder",
      );
    for (const template of input.templates) {
      const renderedBound =
        template.length +
        placeholders(template).reduce(
          (sum, key) =>
            sum +
            Math.max(
              0,
              (input.bindings.find((b) => b.key === key)?.value.length ?? 0) -
                key.length -
                4,
            ),
          0,
        );
      if (
        renderedBound > 65536 ||
        input.count *
          (renderedBound * 2 +
            template.length * 2 +
            JSON.stringify(input.bindings).length * 4 +
            512) >
          900000
      )
        simpleError(
          "templates",
          "Substitution expansion exceeds the bounded output budget.",
          "resource_limit",
        );
    }
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const template = pick(input.templates, random),
          keys = placeholders(template),
          unique = [...new Set(keys)],
          removed =
            input.control === "missing" || input.control === "both"
              ? pick(unique, random)
              : null,
          bindings = input.bindings
            .filter((b) => b.key !== removed)
            .map((b) => ({ ...b }));
        let extraKey = "__extra__";
        while (
          unique.includes(extraKey) ||
          bindings.some((b) => b.key === extraKey)
        )
          extraKey += "_";
        if (input.control === "extra" || input.control === "both")
          bindings.push({ key: extraKey, value: "synthetic-extra" });
        const lookup = new Map(bindings.map((b) => [b.key, b.value])),
          missing = unique.filter((k) => !lookup.has(k)),
          extra = bindings
            .filter((b) => !unique.includes(b.key))
            .map((b) => b.key),
          repeated = unique.filter(
            (k) => keys.filter((key) => key === k).length > 1,
          ),
          rendered = template.replace(
            /\{\{([A-Za-z_][A-Za-z0-9_]*)\}\}/gu,
            (whole: string, key: string) => lookup.get(key) ?? whole,
          );
        return {
          template,
          bindings,
          rendered,
          missing,
          extra,
          repeated,
          prettyBindings: pretty(
            Object.fromEntries(bindings.map((b) => [b.key, b.value])),
          ),
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
export const templatePlaceholderBindingFixtureExample = {
  input: {
    templates: ["Hi {{name}} {{name}}"],
    bindings: [{ key: "name", value: "Ada" }],
    control: "none",
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        template: "Hi {{name}} {{name}}",
        bindings: [{ key: "name", value: "Ada" }],
        rendered: "Hi Ada Ada",
        missing: [],
        extra: [],
        repeated: ["name"],
        prettyBindings: '{\n  "name": "Ada"\n}\n',
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  TemplatePlaceholderBindingFixtureInput,
  TemplatePlaceholderBindingFixtureOutput
>;
export const templatePlaceholderBindingFixtureTool = createModelDefinition<
  TemplatePlaceholderBindingFixtureInput,
  TemplatePlaceholderBindingFixtureOutput
>({
  id: "random/template-placeholder-binding-fixture",
  title: "Random Template Placeholder Binding Fixture Generator",
  description:
    "Construct literal double-brace placeholder binding exercises with missing, extra and repeated-key answers and plain-text substitution.",
  inputSchema,
  outputSchema,
  execute: calculateTemplatePlaceholderBindingFixture,
});
export const runTemplatePlaceholderBindingFixture =
  templatePlaceholderBindingFixtureTool.execute;
export default templatePlaceholderBindingFixtureTool;
